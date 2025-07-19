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

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7c7c", "#8dd1e1"];

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
    { name: "Protein", value: totalNutrition.protein || 0, color: "#8884d8" },
    { name: "Carbs", value: totalNutrition.carbs || 0, color: "#82ca9d" },
    { name: "Fat", value: totalNutrition.fat || 0, color: "#ffc658" }
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
                          outerRadius="80%" 
                          innerRadius="40%"
                          paddingAngle={2}
                          label={({ name, value }) => `${name}: ${value}g`}
                        >
                          {macroData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #e5e7eb', 
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                          }}
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Add Food Entry</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Select value={meal} onValueChange={setMeal}>
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snacks">Snacks</option>
                  </Select>

                  <div>
                    <Input 
                      placeholder="Search foods..." 
                      value={foodSearch}
                      onChange={(e) => setFoodSearch(e.target.value)}
                    />
                    {foodSearch && (
                      <div className="mt-2 max-h-40 overflow-y-auto border rounded">
                        {searchResults.slice(0, 5).map((food, index) => (
                          <div 
                            key={index}
                            className="p-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                            onClick={() => {
                              setSelectedFood(food);
                              setFoodSearch(food.name);
                            }}
                          >
                            <div className="font-medium">{food.name}</div>
                            <div className="text-sm text-gray-600">
                              {food.calories} cal • {food.protein}g protein
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Input 
                      type="number" 
                      placeholder="Quantity"
                      value={quantity}
                      onChange={(e) => setQuantity(parseFloat(e.target.value) || 1)}
                      min="0.1"
                      step="0.1"
                    />
                    <Button onClick={addFoodEntry} disabled={!selectedFood && !customFood.name}>
                      Add Food
                    </Button>
                  </div>

                  {selectedFood && (
                    <div className="p-3 bg-blue-50 rounded">
                      <div className="font-medium">{selectedFood.name}</div>
                      <div className="text-sm text-gray-600">
                        {Math.round(selectedFood.calories * quantity)} calories • 
                        {Math.round(selectedFood.protein * quantity)}g protein • 
                        {Math.round(selectedFood.carbs * quantity)}g carbs • 
                        {Math.round(selectedFood.fat * quantity)}g fat
                      </div>
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">Or add custom food:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <Input 
                        placeholder="Food name"
                        value={customFood.name}
                        onChange={(e) => setCustomFood({...customFood, name: e.target.value})}
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Nutrient Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(DAILY_VALUES).slice(0, 10).map(([nutrient, target]) => {
                      const current = totalNutrition[nutrient] || 0;
                      const percentage = Math.round((current / target) * 100);
                      const status = getNutrientStatus(nutrient, current);
                      
                      return (
                        <div key={nutrient}>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium capitalize">
                              {nutrient.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                            <span className="text-sm text-gray-600">
                              {Math.round(current * 10) / 10} / {target}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="h-2 rounded-full transition-all duration-300" 
                              style={{ 
                                width: `${Math.min(percentage, 100)}%`,
                                backgroundColor: status.color
                              }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">{percentage}% of daily value</div>
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