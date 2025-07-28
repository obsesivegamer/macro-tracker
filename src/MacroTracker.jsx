import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Input, Button, Select, Badge, Tabs, TabsList, TabsTrigger, TabsContent, Progress, Alert, AlertTitle, AlertDescription, Label, HelperText } from "./components/ui.jsx";
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from "recharts";
import { format } from 'date-fns';
import { 
  FOOD_DATABASE, 
  EXERCISE_DATABASE, 
  DAILY_VALUES, 
  searchFoods, 
  calculateCaloriesBurned, 
  calculateNutrientPercentage,
  getNutrientStatus 
} from "./data/nutrition.js";
import { 
  exportToMarkdown, 
  exportToPlainText, 
  exportToCSV, 
  exportToJSON, 
  downloadFile 
} from "./utils/export.js";

// Modern chart color palette aligned with design system
const CHART_COLORS = {
  primary: "#3b82f6",    // Primary blue
  success: "#10b981",    // Success green  
  warning: "#f59e0b",    // Warning amber
  error: "#ef4444",      // Error red
  purple: "#8b5cf6",     // Purple
  teal: "#14b8a6",       // Teal
  orange: "#f97316",     // Orange
  pink: "#ec4899",       // Pink
  indigo: "#6366f1",     // Indigo
  emerald: "#059669"     // Emerald
};

const MACRO_COLORS = {
  protein: CHART_COLORS.primary,
  carbs: CHART_COLORS.success, 
  fat: CHART_COLORS.warning
};

// Chart theme configuration
const CHART_THEME = {
  tooltip: {
    contentStyle: {
      backgroundColor: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05)',
      fontSize: '14px',
      fontWeight: '500',
      padding: '12px 16px'
    },
    labelStyle: {
      color: '#374151',
      fontWeight: '600',
      marginBottom: '4px'
    },
    itemStyle: {
      color: '#6b7280',
      padding: '2px 0'
    }
  },
  legend: {
    wrapperStyle: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#374151',
      paddingTop: '16px'
    }
  },
  grid: {
    stroke: '#f3f4f6',
    strokeWidth: 1
  },
  axis: {
    tick: {
      fontSize: 12,
      fill: '#6b7280',
      fontWeight: '500'
    },
    axisLine: {
      stroke: '#e5e7eb',
      strokeWidth: 1
    },
    tickLine: {
      stroke: '#e5e7eb',
      strokeWidth: 1
    }
  }
};

const TDEECalculator = ({ weight, height, age, activityLevel, gender }) => {
  const BMR = gender === "male"
    ? 10 * weight + 6.25 * height - 5 * age + 5
    : 10 * weight + 6.25 * height - 5 * age - 161;

  const multiplier = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9
  }[activityLevel];

  return BMR * multiplier;
};

export default function MacroTracker() {
  // State management
  const [activeTab, setActiveTab] = useState("dashboard");
  const [entries, setEntries] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [biometrics, setBiometrics] = useState({ weight: [], bodyFat: [], measurements: {} });
  const [goals, setGoals] = useState({
    goal: "maintain",
    activityLevel: "moderate",
    targetCalories: 2000,
    targetProtein: 150,
    targetCarbs: 200,
    targetFat: 70
  });

  // Form states
  const [meal, setMeal] = useState("breakfast");
  const [foodSearch, setFoodSearch] = useState("");
  const [selectedFood, setSelectedFood] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [customFood, setCustomFood] = useState({
    name: "",
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  });

  // User profile
  const [profile, setProfile] = useState({
    weight: 180,
    height: 175,
    age: 30,
    gender: "male",
    activity: "moderate"
  });

  // Exercise form
  const [exerciseForm, setExerciseForm] = useState({
    exercise: "",
    duration: 0,
    date: format(new Date(), 'yyyy-MM-dd')
  });

  // Load data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('macroTrackerData');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        setEntries(data.entries || []);
        setExercises(data.exercises || []);
        setBiometrics(data.biometrics || { weight: [], bodyFat: [], measurements: {} });
        setGoals(data.goals || goals);
        setProfile(data.profile || profile);
      } catch (error) {
        console.error('Failed to load saved data:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    const dataToSave = {
      entries,
      exercises,
      biometrics,
      goals,
      profile,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem('macroTrackerData', JSON.stringify(dataToSave));
  }, [entries, exercises, biometrics, goals, profile]);

  // Calculations
  const tdee = TDEECalculator({ 
    weight: profile.weight, 
    height: profile.height, 
    age: profile.age, 
    activityLevel: profile.activity, 
    gender: profile.gender 
  });

  const targetCalories = goals.goal === "lose" ? tdee - 500 : 
                        goals.goal === "gain" ? tdee + 500 : tdee;

  const todayEntries = entries.filter(e => e.date === format(new Date(), 'yyyy-MM-dd'));
  const totalNutrition = todayEntries.reduce((acc, e) => {
    Object.keys(e).forEach(key => {
      if (typeof e[key] === 'number' && key !== 'id') {
        acc[key] = (acc[key] || 0) + e[key];
      }
    });
    return acc;
  }, {});

  const macroData = [
    { name: "Protein", value: totalNutrition.protein || 0, color: MACRO_COLORS.protein },
    { name: "Carbs", value: totalNutrition.carbs || 0, color: MACRO_COLORS.carbs },
    { name: "Fat", value: totalNutrition.fat || 0, color: MACRO_COLORS.fat }
  ];

  // Functions
  const addFoodEntry = () => {
    if (!selectedFood && !customFood.name) return;

    const foodData = selectedFood || customFood;
    const entry = {
      id: Date.now(),
      date: format(new Date(), 'yyyy-MM-dd'),
      meal,
      food: foodData.name,
      quantity,
      calories: Math.round((foodData.calories || 0) * quantity),
      protein: Math.round((foodData.protein || 0) * quantity),
      carbs: Math.round((foodData.carbs || 0) * quantity),
      fat: Math.round((foodData.fat || 0) * quantity),
      fiber: Math.round((foodData.fiber || 0) * quantity),
      sugar: Math.round((foodData.sugar || 0) * quantity),
      sodium: Math.round((foodData.sodium || 0) * quantity),
      potassium: Math.round((foodData.potassium || 0) * quantity),
      calcium: Math.round((foodData.calcium || 0) * quantity),
      iron: Math.round((foodData.iron || 0) * quantity * 10) / 10,
      magnesium: Math.round((foodData.magnesium || 0) * quantity),
      vitaminA: Math.round((foodData.vitaminA || 0) * quantity),
      vitaminC: Math.round((foodData.vitaminC || 0) * quantity),
      vitaminD: Math.round((foodData.vitaminD || 0) * quantity * 10) / 10,
      vitaminE: Math.round((foodData.vitaminE || 0) * quantity * 10) / 10,
      vitaminK: Math.round((foodData.vitaminK || 0) * quantity),
      folate: Math.round((foodData.folate || 0) * quantity)
    };

    setEntries([...entries, entry]);
    setSelectedFood(null);
    setFoodSearch("");
    setQuantity(1);
    setCustomFood({ name: "", calories: 0, protein: 0, carbs: 0, fat: 0 });
  };

  const addExercise = () => {
    if (!exerciseForm.exercise || !exerciseForm.duration) return;

    const caloriesBurned = calculateCaloriesBurned(
      exerciseForm.exercise, 
      exerciseForm.duration, 
      profile.weight * 0.453592 // Convert lbs to kg
    );

    const exercise = {
      id: Date.now(),
      date: exerciseForm.date,
      exercise: EXERCISE_DATABASE[exerciseForm.exercise]?.name || exerciseForm.exercise,
      duration: exerciseForm.duration,
      caloriesBurned
    };

    setExercises([...exercises, exercise]);
    setExerciseForm({ exercise: "", duration: 0, date: format(new Date(), 'yyyy-MM-dd') });
  };

  const exportData = (format) => {
    const exportData = {
      entries,
      exercises,
      biometrics,
      goals,
      profile,
      dateRange: { start: null, end: null }
    };

    let content, filename, type;

    switch (format) {
      case 'markdown':
        content = exportToMarkdown(exportData);
        filename = `nutrition-data-${format(new Date(), 'yyyy-MM-dd')}.md`;
        type = 'text/markdown';
        break;
      case 'plaintext':
        content = exportToPlainText(exportData);
        filename = `nutrition-summary-${format(new Date(), 'yyyy-MM-dd')}.txt`;
        type = 'text/plain';
        break;
      case 'csv':
        content = exportToCSV(entries);
        filename = `nutrition-data-${format(new Date(), 'yyyy-MM-dd')}.csv`;
        type = 'text/csv';
        break;
      case 'json':
        content = exportToJSON(exportData);
        filename = `nutrition-data-${format(new Date(), 'yyyy-MM-dd')}.json`;
        type = 'application/json';
        break;
      case 'clipboard':
        const llmOptimized = exportToPlainText(exportData);
        navigator.clipboard.writeText(llmOptimized);
        alert("✅ Nutrition data copied to clipboard!\n\nPaste this into your preferred AI assistant for personalized analysis and recommendations.");
        return;
    }

    downloadFile(content, filename, type);
  };

  const searchResults = searchFoods(foodSearch);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Comprehensive Macro Tracker</h1>
          <p className="text-gray-600">Track nutrition, exercise, and health metrics with detailed analysis</p>
        </header>

        <Tabs>
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1 p-1 bg-neutral-100 rounded-lg">
            <TabsTrigger 
              value="dashboard" 
              isActive={activeTab === "dashboard"}
              onClick={setActiveTab}
              size="md"
              className="min-w-0 flex-1"
            >
              <span className="hidden sm:inline">Dashboard</span>
              <span className="sm:hidden">📊</span>
            </TabsTrigger>
            <TabsTrigger 
              value="food" 
              isActive={activeTab === "food"}
              onClick={setActiveTab}
              size="md"
              className="min-w-0 flex-1"
            >
              <span className="hidden sm:inline">Food Log</span>
              <span className="sm:hidden">🍽️</span>
            </TabsTrigger>
            <TabsTrigger 
              value="exercise" 
              isActive={activeTab === "exercise"}
              onClick={setActiveTab}
              size="md"
              className="min-w-0 flex-1"
            >
              <span className="hidden sm:inline">Exercise</span>
              <span className="sm:hidden">🏃</span>
            </TabsTrigger>
            <TabsTrigger 
              value="analysis" 
              isActive={activeTab === "analysis"}
              onClick={setActiveTab}
              size="md"
              className="min-w-0 flex-1"
            >
              <span className="hidden sm:inline">Analysis</span>
              <span className="sm:hidden">📈</span>
            </TabsTrigger>
            <TabsTrigger 
              value="export" 
              isActive={activeTab === "export"}
              onClick={setActiveTab}
              size="md"
              className="min-w-0 flex-1"
            >
              <span className="hidden sm:inline">Export</span>
              <span className="sm:hidden">📤</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" activeTab={activeTab}>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
              <Card variant="default" className="animate-fade-in">
                <CardHeader size="default">
                  <CardTitle level={3}>Today's Overview</CardTitle>
                </CardHeader>
                <CardContent size="default">
                  <div className="space-y-6">
                    {/* Calories Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-neutral-700">Calories</span>
                        <span className="text-sm font-semibold text-neutral-900">
                          {Math.round(totalNutrition.calories || 0)} / {Math.round(targetCalories)}
                        </span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-3 overflow-hidden">
                        <div 
                          className="bg-primary-600 h-3 rounded-full transition-all duration-500 ease-out" 
                          style={{ width: `${Math.min(((totalNutrition.calories || 0) / targetCalories) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* Macro Stats Grid */}
                    <div className="grid grid-cols-3 gap-3 sm:gap-4">
                      <div className="text-center p-3 bg-primary-50 rounded-lg border border-primary-100">
                        <div className="text-xl sm:text-2xl font-bold text-primary-700">{Math.round(totalNutrition.protein || 0)}g</div>
                        <div className="text-xs sm:text-sm text-primary-600 font-medium">Protein</div>
                      </div>
                      <div className="text-center p-3 bg-success-50 rounded-lg border border-success-100">
                        <div className="text-xl sm:text-2xl font-bold text-success-700">{Math.round(totalNutrition.carbs || 0)}g</div>
                        <div className="text-xs sm:text-sm text-success-600 font-medium">Carbs</div>
                      </div>
                      <div className="text-center p-3 bg-warning-50 rounded-lg border border-warning-100">
                        <div className="text-xl sm:text-2xl font-bold text-warning-700">{Math.round(totalNutrition.fat || 0)}g</div>
                        <div className="text-xs sm:text-sm text-warning-600 font-medium">Fat</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card variant="default" className="animate-fade-in">
                <CardHeader size="default">
                  <CardTitle level={3}>Macro Distribution</CardTitle>
                  <CardDescription>Visual breakdown of your daily macronutrients</CardDescription>
                </CardHeader>
                <CardContent size="default">
                  <div className="h-48 sm:h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie 
                          data={macroData} 
                          dataKey="value" 
                          outerRadius="85%" 
                          innerRadius="45%"
                          paddingAngle={3}
                          animationBegin={0}
                          animationDuration={800}
                          label={({ name, value, percent }) => 
                            value > 0 ? `${name}: ${value}g (${(percent * 100).toFixed(0)}%)` : ''
                          }
                          labelLine={false}
                          style={{ 
                            filter: 'drop-shadow(0 1px 2px rgb(0 0 0 / 0.1))',
                            fontSize: '12px',
                            fontWeight: '500'
                          }}
                        >
                          {macroData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={entry.color}
                              stroke="white"
                              strokeWidth={2}
                              style={{
                                filter: 'brightness(1)',
                                transition: 'all 0.2s ease-in-out'
                              }}
                            />
                          ))}
                        </Pie>
                        <Tooltip 
                          {...CHART_THEME.tooltip}
                          formatter={(value, name) => [
                            `${value}g`,
                            name
                          ]}
                          labelFormatter={() => 'Macronutrients'}
                        />
                        <Legend 
                          {...CHART_THEME.legend}
                          iconType="circle"
                          layout="horizontal"
                          align="center"
                          verticalAlign="bottom"
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card variant="default" className="animate-fade-in">
              <CardHeader size="default">
                <CardTitle level={3}>Key Nutrients Status</CardTitle>
                <CardDescription>Track your essential vitamins and minerals</CardDescription>
              </CardHeader>
              <CardContent size="default">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                  {['vitaminC', 'vitaminD', 'calcium', 'iron', 'fiber', 'potassium'].map(nutrient => {
                    const amount = totalNutrition[nutrient] || 0;
                    const status = getNutrientStatus(nutrient, amount);
                    const percentage = calculateNutrientPercentage(nutrient, amount);
                    
                    return (
                      <div key={nutrient} className="p-4 bg-neutral-50 rounded-lg border border-neutral-200 text-center space-y-2">
                        <div className="text-lg font-bold" style={{ color: status.color }}>
                          {Math.round(amount * 10) / 10}
                        </div>
                        <div className="text-xs font-medium text-neutral-600 capitalize leading-tight">
                          {nutrient.replace(/([A-Z])/g, ' $1').trim()}
                        </div>
                        <Progress 
                          value={percentage} 
                          max={100}
                          size="sm"
                          variant={status.status === 'good' ? 'success' : status.status === 'low' ? 'error' : 'warning'}
                          className="w-full"
                        />
                        <Badge 
                          variant={status.status === 'good' ? 'success' : status.status === 'low' ? 'destructive' : 'warning'}
                          size="sm"
                        >
                          {percentage}% DV
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="food" activeTab={activeTab}>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
              <Card variant="default" className="animate-fade-in">
                <CardHeader size="default">
                  <CardTitle level={3}>Add Food Entry</CardTitle>
                  <CardDescription>Log your meals and track nutrition</CardDescription>
                </CardHeader>
                <CardContent size="default" className="space-y-6">
                  {/* Meal Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="meal-select">Meal Category</Label>
                    <Select 
                      value={meal} 
                      onValueChange={setMeal}
                      size="md"
                      placeholder="Select meal..."
                    >
                      <option value="breakfast">🌅 Breakfast</option>
                      <option value="lunch">☀️ Lunch</option>
                      <option value="dinner">🌙 Dinner</option>
                      <option value="snacks">🍿 Snacks</option>
                    </Select>
                  </div>

                  {/* Food Search */}
                  <div className="space-y-2">
                    <Label htmlFor="food-search">Search Foods</Label>
                    <Input 
                      id="food-search"
                      placeholder="Type to search foods..." 
                      value={foodSearch}
                      onChange={(e) => setFoodSearch(e.target.value)}
                      size="md"
                      icon={<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>}
                    />
                    {foodSearch && searchResults.length > 0 && (
                      <div className="mt-2 max-h-48 overflow-y-auto border border-neutral-200 rounded-lg bg-white shadow-sm">
                        {searchResults.slice(0, 5).map((food, index) => (
                          <div 
                            key={index}
                            className="p-3 hover:bg-neutral-50 cursor-pointer border-b border-neutral-100 last:border-b-0 transition-colors"
                            onClick={() => {
                              setSelectedFood(food);
                              setFoodSearch(food.name);
                            }}
                          >
                            <div className="font-medium text-neutral-900">{food.name}</div>
                            <div className="text-sm text-neutral-600 mt-1">
                              {food.calories} cal • {food.protein}g protein • {food.carbs}g carbs • {food.fat}g fat
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Quantity and Add Button */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input 
                        id="quantity"
                        type="number" 
                        placeholder="1.0"
                        value={quantity}
                        onChange={(e) => setQuantity(parseFloat(e.target.value) || 1)}
                        min="0.1"
                        step="0.1"
                        size="md"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>&nbsp;</Label>
                      <Button 
                        onClick={addFoodEntry} 
                        disabled={!selectedFood && !customFood.name}
                        variant="primary"
                        size="md"
                        fullWidth
                      >
                        Add Food
                      </Button>
                    </div>
                  </div>

                  {/* Selected Food Preview */}
                  {selectedFood && (
                    <Alert variant="info" className="animate-fade-in">
                      <AlertTitle>Selected: {selectedFood.name}</AlertTitle>
                      <AlertDescription>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 text-sm">
                          <span><strong>{Math.round(selectedFood.calories * quantity)}</strong> cal</span>
                          <span><strong>{Math.round(selectedFood.protein * quantity)}g</strong> protein</span>
                          <span><strong>{Math.round(selectedFood.carbs * quantity)}g</strong> carbs</span>
                          <span><strong>{Math.round(selectedFood.fat * quantity)}g</strong> fat</span>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Custom Food Section */}
                  <div className="border-t border-neutral-200 pt-6 space-y-4">
                    <div>
                      <h4 className="font-semibold text-neutral-900 mb-1">Add Custom Food</h4>
                      <p className="text-sm text-neutral-600">Can't find your food? Add it manually</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="custom-name">Food Name</Label>
                        <Input 
                          id="custom-name"
                          placeholder="e.g., Homemade Pasta"
                          value={customFood.name}
                          onChange={(e) => setCustomFood({...customFood, name: e.target.value})}
                          size="md"
                        />
                      </div>
                      />
                      <Input 
                        type="number" 
                        placeholder="Calories"
                        value={customFood.calories}
                        onChange={(e) => setCustomFood({...customFood, calories: parseFloat(e.target.value) || 0})}
                      />
                      <Input 
                        type="number" 
                        placeholder="Protein (g)"
                        value={customFood.protein}
                        onChange={(e) => setCustomFood({...customFood, protein: parseFloat(e.target.value) || 0})}
                      />
                      <Input 
                        type="number" 
                        placeholder="Carbs (g)"
                        value={customFood.carbs}
                        onChange={(e) => setCustomFood({...customFood, carbs: parseFloat(e.target.value) || 0})}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Today's Food Log</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {todayEntries.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">No food logged today</p>
                    ) : (
                      todayEntries.map((entry, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium">{entry.food}</div>
                              <div className="text-sm text-gray-600 capitalize">{entry.meal}</div>
                            </div>
                            <div className="text-right text-sm">
                              <div className="font-medium">{entry.calories} cal</div>
                              <div className="text-gray-600">
                                P: {entry.protein}g C: {entry.carbs}g F: {entry.fat}g
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="exercise" activeTab={activeTab}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Log Exercise</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Select 
                    value={exerciseForm.exercise} 
                    onValueChange={(value) => setExerciseForm({...exerciseForm, exercise: value})}
                  >
                    <option value="">Select exercise</option>
                    {Object.entries(EXERCISE_DATABASE).map(([key, exercise]) => (
                      <option key={key} value={key}>{exercise.name}</option>
                    ))}
                  </Select>

                  <Input 
                    type="number" 
                    placeholder="Duration (minutes)"
                    value={exerciseForm.duration}
                    onChange={(e) => setExerciseForm({...exerciseForm, duration: parseInt(e.target.value) || 0})}
                  />

                  <Input 
                    type="date"
                    value={exerciseForm.date}
                    onChange={(e) => setExerciseForm({...exerciseForm, date: e.target.value})}
                  />

                  <Button onClick={addExercise} disabled={!exerciseForm.exercise || !exerciseForm.duration}>
                    Log Exercise
                  </Button>

                  {exerciseForm.exercise && exerciseForm.duration && (
                    <div className="p-3 bg-green-50 rounded">
                      <div className="font-medium">
                        {EXERCISE_DATABASE[exerciseForm.exercise]?.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        Estimated: {calculateCaloriesBurned(exerciseForm.exercise, exerciseForm.duration, profile.weight * 0.453592)} calories burned
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Exercise</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {exercises.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">No exercise logged yet</p>
                    ) : (
                      exercises.slice(-10).reverse().map((exercise, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium">{exercise.exercise}</div>
                              <div className="text-sm text-gray-600">{format(new Date(exercise.date), 'PPP')}</div>
                            </div>
                            <div className="text-right text-sm">
                              <div className="font-medium">{exercise.duration} min</div>
                              <div className="text-gray-600">{exercise.caloriesBurned} cal</div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analysis" activeTab={activeTab}>
            <div className="space-y-6">
              {/* Weekly Trends Chart */}
              <Card variant="default" className="animate-fade-in">
                <CardHeader size="default">
                  <CardTitle level={3}>Weekly Nutrition Trends</CardTitle>
                  <CardDescription>Track your daily nutrition intake over the past week</CardDescription>
                </CardHeader>
                <CardContent size="default">
                  <div className="h-64 sm:h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={(() => {
                        // Generate last 7 days of data
                        const last7Days = [];
                        for (let i = 6; i >= 0; i--) {
                          const date = new Date();
                          date.setDate(date.getDate() - i);
                          const dateStr = format(date, 'yyyy-MM-dd');
                          const dayEntries = entries.filter(e => e.date === dateStr);
                          const dayNutrition = dayEntries.reduce((acc, e) => {
                            acc.calories = (acc.calories || 0) + (e.calories || 0);
                            acc.protein = (acc.protein || 0) + (e.protein || 0);
                            acc.carbs = (acc.carbs || 0) + (e.carbs || 0);
                            acc.fat = (acc.fat || 0) + (e.fat || 0);
                            return acc;
                          }, {});
                          
                          last7Days.push({
                            date: format(date, 'MMM dd'),
                            calories: Math.round(dayNutrition.calories || 0),
                            protein: Math.round(dayNutrition.protein || 0),
                            carbs: Math.round(dayNutrition.carbs || 0),
                            fat: Math.round(dayNutrition.fat || 0)
                          });
                        }
                        return last7Days;
                      })()}>
                        <CartesianGrid {...CHART_THEME.grid} />
                        <XAxis 
                          dataKey="date" 
                          {...CHART_THEME.axis}
                          tick={{ ...CHART_THEME.axis.tick, fontSize: 11 }}
                        />
                        <YAxis 
                          {...CHART_THEME.axis}
                          tick={{ ...CHART_THEME.axis.tick, fontSize: 11 }}
                        />
                        <Tooltip 
                          {...CHART_THEME.tooltip}
                          labelFormatter={(label) => `Date: ${label}`}
                          formatter={(value, name) => [
                            name === 'calories' ? `${value} cal` : `${value}g`,
                            name.charAt(0).toUpperCase() + name.slice(1)
                          ]}
                        />
                        <Legend {...CHART_THEME.legend} />
                        <Line 
                          type="monotone" 
                          dataKey="calories" 
                          stroke={CHART_COLORS.primary}
                          strokeWidth={3}
                          dot={{ fill: CHART_COLORS.primary, strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6, stroke: CHART_COLORS.primary, strokeWidth: 2, fill: 'white' }}
                          name="Calories"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="protein" 
                          stroke={MACRO_COLORS.protein}
                          strokeWidth={2}
                          dot={{ fill: MACRO_COLORS.protein, strokeWidth: 2, r: 3 }}
                          activeDot={{ r: 5, stroke: MACRO_COLORS.protein, strokeWidth: 2, fill: 'white' }}
                          name="Protein"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="carbs" 
                          stroke={MACRO_COLORS.carbs}
                          strokeWidth={2}
                          dot={{ fill: MACRO_COLORS.carbs, strokeWidth: 2, r: 3 }}
                          activeDot={{ r: 5, stroke: MACRO_COLORS.carbs, strokeWidth: 2, fill: 'white' }}
                          name="Carbs"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="fat" 
                          stroke={MACRO_COLORS.fat}
                          strokeWidth={2}
                          dot={{ fill: MACRO_COLORS.fat, strokeWidth: 2, r: 3 }}
                          activeDot={{ r: 5, stroke: MACRO_COLORS.fat, strokeWidth: 2, fill: 'white' }}
                          name="Fat"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Nutrient Comparison Bar Chart */}
              <Card variant="default" className="animate-fade-in">
                <CardHeader size="default">
                  <CardTitle level={3}>Nutrient Goals vs Actual</CardTitle>
                  <CardDescription>Compare your daily intake against recommended values</CardDescription>
                </CardHeader>
                <CardContent size="default">
                  <div className="h-64 sm:h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={(() => {
                        const keyNutrients = ['protein', 'carbs', 'fat', 'fiber', 'vitaminC', 'calcium', 'iron'];
                        return keyNutrients.map(nutrient => {
                          const current = totalNutrition[nutrient] || 0;
                          const target = DAILY_VALUES[nutrient] || 100;
                          const percentage = Math.min((current / target) * 100, 150); // Cap at 150% for display
                          
                          return {
                            name: nutrient.replace(/([A-Z])/g, ' $1').trim(),
                            current: Math.round(current * 10) / 10,
                            target: target,
                            percentage: Math.round(percentage),
                            status: getNutrientStatus(nutrient, current).status
                          };
                        });
                      })()}>
                        <CartesianGrid {...CHART_THEME.grid} />
                        <XAxis 
                          dataKey="name" 
                          {...CHART_THEME.axis}
                          tick={{ ...CHART_THEME.axis.tick, fontSize: 10 }}
                          angle={-45}
                          textAnchor="end"
                          height={80}
                        />
                        <YAxis 
                          {...CHART_THEME.axis}
                          tick={{ ...CHART_THEME.axis.tick, fontSize: 11 }}
                          label={{ value: '% of Daily Value', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: '12px', fill: '#6b7280' } }}
                        />
                        <Tooltip 
                          {...CHART_THEME.tooltip}
                          formatter={(value, name) => [
                            name === 'percentage' ? `${value}%` : value,
                            name === 'percentage' ? 'Daily Value' : name === 'current' ? 'Current Intake' : 'Target'
                          ]}
                          labelFormatter={(label) => `Nutrient: ${label}`}
                        />
                        <Bar 
                          dataKey="percentage" 
                          fill={CHART_COLORS.primary}
                          radius={[4, 4, 0, 0]}
                          style={{
                            filter: 'drop-shadow(0 1px 2px rgb(0 0 0 / 0.1))'
                          }}
                        >
                          {(() => {
                            const keyNutrients = ['protein', 'carbs', 'fat', 'fiber', 'vitaminC', 'calcium', 'iron'];
                            return keyNutrients.map((nutrient, index) => {
                              const current = totalNutrition[nutrient] || 0;
                              const status = getNutrientStatus(nutrient, current);
                              const color = status.status === 'good' ? CHART_COLORS.success : 
                                          status.status === 'low' ? CHART_COLORS.error : 
                                          CHART_COLORS.warning;
                              return <Cell key={`cell-${index}`} fill={color} />;
                            });
                          })()}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card variant="default" className="animate-fade-in">
                  <CardHeader size="default">
                    <CardTitle level={3}>Detailed Nutrient Analysis</CardTitle>
                    <CardDescription>Track your essential vitamins and minerals</CardDescription>
                  </CardHeader>
                  <CardContent size="default">
                    <div className="space-y-4">
                      {Object.entries(DAILY_VALUES).slice(0, 10).map(([nutrient, target]) => {
                        const current = totalNutrition[nutrient] || 0;
                        const percentage = Math.round((current / target) * 100);
                        const status = getNutrientStatus(nutrient, current);
                        
                        return (
                          <div key={nutrient} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-neutral-900 capitalize">
                                {nutrient.replace(/([A-Z])/g, ' $1').trim()}
                              </span>
                              <span className="text-sm font-semibold text-neutral-700">
                                {Math.round(current * 10) / 10} / {target}
                              </span>
                            </div>
                            <Progress 
                              value={percentage} 
                              max={100}
                              size="md"
                              variant={status.status === 'good' ? 'success' : status.status === 'low' ? 'error' : 'warning'}
                              className="w-full"
                            />
                            <div className="flex justify-between items-center">
                              <Badge 
                                variant={status.status === 'good' ? 'success' : status.status === 'low' ? 'destructive' : 'warning'}
                                size="sm"
                              >
                                {percentage}% DV
                              </Badge>
                              <span className="text-xs text-neutral-500 font-medium">
                                {status.status === 'good' ? '✓ Good' : status.status === 'low' ? '⚠ Low' : '⚡ High'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Profile & Goals</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Personal Information</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <Input 
                        type="number" 
                        placeholder="Weight (lbs)"
                        value={profile.weight}
                        onChange={(e) => setProfile({...profile, weight: parseFloat(e.target.value) || 0})}
                      />
                      <Input 
                        type="number" 
                        placeholder="Height (cm)"
                        value={profile.height}
                        onChange={(e) => setProfile({...profile, height: parseFloat(e.target.value) || 0})}
                      />
                      <Input 
                        type="number" 
                        placeholder="Age"
                        value={profile.age}
                        onChange={(e) => setProfile({...profile, age: parseInt(e.target.value) || 0})}
                      />
                      <Select 
                        value={profile.gender} 
                        onValueChange={(value) => setProfile({...profile, gender: value})}
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Goals</h4>
                    <Select 
                      value={goals.goal} 
                      onValueChange={(value) => setGoals({...goals, goal: value})}
                    >
                      <option value="lose">Lose Weight</option>
                      <option value="maintain">Maintain Weight</option>
                      <option value="gain">Gain Weight</option>
                    </Select>
                  </div>

                  <div className="p-3 bg-blue-50 rounded">
                    <div className="text-sm font-medium">Calculated TDEE</div>
                    <div className="text-2xl font-bold text-blue-600">{Math.round(tdee)} calories</div>
                    <div className="text-sm text-gray-600">
                      Target: {Math.round(targetCalories)} calories/day
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="export" activeTab={activeTab}>
            <Card>
              <CardHeader>
                <CardTitle>Export Your Data</CardTitle>
                <p className="text-gray-600">Export your nutrition data for analysis or backup</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    onClick={() => exportData('clipboard')}
                    className="h-auto p-4 flex flex-col items-start"
                  >
                    <div className="font-medium">📋 Copy for AI Analysis</div>
                    <div className="text-sm opacity-90 mt-1">
                      Optimized format for ChatGPT, Claude, or other AI assistants
                    </div>
                  </Button>

                  <Button 
                    variant="outline"
                    onClick={() => exportData('markdown')}
                    className="h-auto p-4 flex flex-col items-start"
                  >
                    <div className="font-medium">📄 Markdown Report</div>
                    <div className="text-sm opacity-70 mt-1">
                      Comprehensive report with analysis and recommendations
                    </div>
                  </Button>

                  <Button 
                    variant="outline"
                    onClick={() => exportData('csv')}
                    className="h-auto p-4 flex flex-col items-start"
                  >
                    <div className="font-medium">📊 CSV Data</div>
                    <div className="text-sm opacity-70 mt-1">
                      Spreadsheet format for advanced analysis
                    </div>
                  </Button>

                  <Button 
                    variant="outline"
                    onClick={() => exportData('json')}
                    className="h-auto p-4 flex flex-col items-start"
                  >
                    <div className="font-medium">⚙️ JSON Backup</div>
                    <div className="text-sm opacity-70 mt-1">
                      Complete data backup in technical format
                    </div>
                  </Button>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">💡 AI Analysis Tips</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Use "Copy for AI Analysis" for quick health insights</li>
                    <li>• Ask AI about nutrient deficiencies and meal optimization</li>
                    <li>• Request personalized recommendations based on your goals</li>
                    <li>• Compare your patterns to recommended guidelines</li>
                  </ul>
                </div>

                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">
                    <strong>Data Summary:</strong> {entries.length} food entries, {exercises.length} exercise sessions
                    {entries.length > 0 && ` • First entry: ${format(new Date(entries[0]?.date || new Date()), 'PPP')}`}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}