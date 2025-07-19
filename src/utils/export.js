import { format } from 'date-fns';
import { DAILY_VALUES, calculateNutrientPercentage } from '../data/nutrition.js';

// Export utilities for LLM analysis and other formats
export const exportToMarkdown = (data) => {
  const { entries, exercises, biometrics, goals, dateRange } = data;
  
  const totalNutrition = calculateTotalNutrition(entries);
  const totalExercise = calculateTotalExercise(exercises);
  
  let markdown = `# Nutrition & Health Data Export\n\n`;
  markdown += `**Export Date:** ${format(new Date(), 'PPP')}\n`;
  markdown += `**Date Range:** ${dateRange?.start ? format(new Date(dateRange.start), 'PPP') : 'All time'} - ${dateRange?.end ? format(new Date(dateRange.end), 'PPP') : 'Present'}\n\n`;
  
  // Summary Section
  markdown += `## Executive Summary\n\n`;
  markdown += `- **Total Days Tracked:** ${getUniqueDays(entries)}\n`;
  markdown += `- **Average Daily Calories:** ${Math.round(totalNutrition.calories / getUniqueDays(entries))}\n`;
  markdown += `- **Total Exercise Sessions:** ${exercises.length}\n`;
  markdown += `- **Current Weight:** ${biometrics.weight?.slice(-1)[0]?.value || 'Not recorded'} lbs\n\n`;
  
  // Nutrition Analysis
  markdown += `## Nutrition Analysis\n\n`;
  markdown += `### Daily Averages vs Targets\n\n`;
  markdown += `| Nutrient | Average | Target | % of Target | Status |\n`;
  markdown += `|----------|---------|---------|-------------|--------|\n`;
  
  const avgDays = getUniqueDays(entries);
  Object.entries(totalNutrition).forEach(([nutrient, total]) => {
    if (DAILY_VALUES[nutrient]) {
      const avg = Math.round(total / avgDays);
      const target = DAILY_VALUES[nutrient];
      const percentage = Math.round((avg / target) * 100);
      const status = percentage < 75 ? '⚠️ Low' : percentage > 120 ? '⚠️ High' : '✅ Good';
      markdown += `| ${formatNutrientName(nutrient)} | ${avg} | ${target} | ${percentage}% | ${status} |\n`;
    }
  });
  
  markdown += `\n### Key Findings\n\n`;
  const findings = generateFindings(totalNutrition, avgDays);
  findings.forEach(finding => {
    markdown += `- ${finding}\n`;
  });
  
  // Food Log
  markdown += `\n## Food Log (Recent 7 Days)\n\n`;
  const recentEntries = entries.slice(-50); // Last 50 entries
  const groupedByDate = groupEntriesByDate(recentEntries);
  
  Object.entries(groupedByDate).forEach(([date, dayEntries]) => {
    markdown += `### ${format(new Date(date), 'EEEE, PPP')}\n\n`;
    const dayTotals = calculateTotalNutrition(dayEntries);
    markdown += `**Daily Totals:** ${Math.round(dayTotals.calories)} calories, ${Math.round(dayTotals.protein)}g protein, ${Math.round(dayTotals.carbs)}g carbs, ${Math.round(dayTotals.fat)}g fat\n\n`;
    
    ['breakfast', 'lunch', 'dinner', 'snacks'].forEach(meal => {
      const mealEntries = dayEntries.filter(e => e.meal === meal);
      if (mealEntries.length > 0) {
        markdown += `**${meal.charAt(0).toUpperCase() + meal.slice(1)}:**\n`;
        mealEntries.forEach(entry => {
          markdown += `- ${entry.food}: ${entry.calories} cal (P: ${entry.protein}g, C: ${entry.carbs}g, F: ${entry.fat}g)\n`;
        });
        markdown += `\n`;
      }
    });
  });
  
  // Exercise Log
  if (exercises.length > 0) {
    markdown += `## Exercise Log\n\n`;
    exercises.slice(-20).forEach(exercise => {
      markdown += `- **${format(new Date(exercise.date), 'PPP')}:** ${exercise.exercise} for ${exercise.duration} minutes (${exercise.caloriesBurned} calories burned)\n`;
    });
  }
  
  // Recommendations for LLM Analysis
  markdown += `\n## For AI Analysis\n\n`;
  markdown += `### Questions to Consider:\n`;
  markdown += `1. Are there any nutrient deficiencies I should be concerned about?\n`;
  markdown += `2. How can I optimize my nutrition for my health goals?\n`;
  markdown += `3. What changes would you recommend to improve my diet quality?\n`;
  markdown += `4. Are my portion sizes and meal timing appropriate?\n`;
  markdown += `5. How does my exercise routine complement my nutrition?\n\n`;
  
  markdown += `### Context for Analysis:\n`;
  markdown += `- **Goals:** ${goals.goal || 'General health'}\n`;
  markdown += `- **Activity Level:** ${goals.activityLevel || 'Moderate'}\n`;
  markdown += `- **Any Restrictions:** ${goals.restrictions || 'None specified'}\n`;
  
  return markdown;
};

export const exportToPlainText = (data) => {
  const { entries, exercises, biometrics } = data;
  
  const totalNutrition = calculateTotalNutrition(entries);
  const avgDays = getUniqueDays(entries);
  
  let text = `NUTRITION & HEALTH DATA SUMMARY\n`;
  text += `Export Date: ${format(new Date(), 'PPP')}\n`;
  text += `Total Days: ${avgDays}\n\n`;
  
  text += `DAILY AVERAGES:\n`;
  text += `Calories: ${Math.round(totalNutrition.calories / avgDays)}\n`;
  text += `Protein: ${Math.round(totalNutrition.protein / avgDays)}g\n`;
  text += `Carbs: ${Math.round(totalNutrition.carbs / avgDays)}g\n`;
  text += `Fat: ${Math.round(totalNutrition.fat / avgDays)}g\n`;
  text += `Fiber: ${Math.round(totalNutrition.fiber / avgDays)}g\n\n`;
  
  text += `MICRONUTRIENTS (Daily Average):\n`;
  ['vitaminC', 'vitaminD', 'calcium', 'iron', 'potassium'].forEach(nutrient => {
    const avg = Math.round(totalNutrition[nutrient] / avgDays);
    const target = DAILY_VALUES[nutrient];
    const percent = Math.round((avg / target) * 100);
    text += `${formatNutrientName(nutrient)}: ${avg} (${percent}% of target)\n`;
  });
  
  text += `\nRECENT FOOD ENTRIES:\n`;
  entries.slice(-20).forEach(entry => {
    text += `${entry.meal}: ${entry.food} - ${entry.calories} cal\n`;
  });
  
  if (exercises.length > 0) {
    text += `\nRECENT EXERCISE:\n`;
    exercises.slice(-10).forEach(exercise => {
      text += `${exercise.exercise}: ${exercise.duration} min - ${exercise.caloriesBurned} cal\n`;
    });
  }
  
  return text;
};

export const exportToCSV = (entries) => {
  const headers = [
    'Date', 'Meal', 'Food', 'Calories', 'Protein', 'Carbs', 'Fat', 'Fiber',
    'Vitamin C', 'Vitamin D', 'Calcium', 'Iron', 'Potassium'
  ];
  
  let csv = headers.join(',') + '\n';
  
  entries.forEach(entry => {
    const row = [
      entry.date || format(new Date(), 'yyyy-MM-dd'),
      entry.meal,
      `"${entry.food}"`,
      entry.calories,
      entry.protein,
      entry.carbs,
      entry.fat,
      entry.fiber || 0,
      entry.vitaminC || 0,
      entry.vitaminD || 0,
      entry.calcium || 0,
      entry.iron || 0,
      entry.potassium || 0
    ];
    csv += row.join(',') + '\n';
  });
  
  return csv;
};

export const exportToJSON = (data) => {
  return JSON.stringify({
    exportDate: new Date().toISOString(),
    ...data,
    summary: {
      totalDays: getUniqueDays(data.entries),
      averageNutrition: calculateAverageNutrition(data.entries),
      totalExercise: calculateTotalExercise(data.exercises || [])
    }
  }, null, 2);
};

// Helper functions
const calculateTotalNutrition = (entries) => {
  return entries.reduce((total, entry) => {
    Object.keys(entry).forEach(key => {
      if (typeof entry[key] === 'number' && key !== 'id') {
        total[key] = (total[key] || 0) + entry[key];
      }
    });
    return total;
  }, {});
};

const calculateTotalExercise = (exercises) => {
  return exercises.reduce((total, exercise) => {
    total.sessions += 1;
    total.totalMinutes += exercise.duration || 0;
    total.totalCalories += exercise.caloriesBurned || 0;
    return total;
  }, { sessions: 0, totalMinutes: 0, totalCalories: 0 });
};

const calculateAverageNutrition = (entries) => {
  const total = calculateTotalNutrition(entries);
  const days = getUniqueDays(entries);
  
  const average = {};
  Object.entries(total).forEach(([key, value]) => {
    average[key] = Math.round(value / days);
  });
  
  return average;
};

const getUniqueDays = (entries) => {
  const uniqueDates = new Set(
    entries.map(entry => entry.date || format(new Date(), 'yyyy-MM-dd'))
  );
  return Math.max(uniqueDates.size, 1);
};

const groupEntriesByDate = (entries) => {
  return entries.reduce((groups, entry) => {
    const date = entry.date || format(new Date(), 'yyyy-MM-dd');
    if (!groups[date]) groups[date] = [];
    groups[date].push(entry);
    return groups;
  }, {});
};

const formatNutrientName = (nutrient) => {
  const names = {
    vitaminA: 'Vitamin A',
    vitaminC: 'Vitamin C',
    vitaminD: 'Vitamin D',
    vitaminE: 'Vitamin E',
    vitaminK: 'Vitamin K',
    vitaminB6: 'Vitamin B6',
    vitaminB12: 'Vitamin B12',
    thiamine: 'Thiamine (B1)',
    riboflavin: 'Riboflavin (B2)',
    niacin: 'Niacin (B3)',
    folate: 'Folate',
    calcium: 'Calcium',
    iron: 'Iron',
    magnesium: 'Magnesium',
    phosphorus: 'Phosphorus',
    potassium: 'Potassium',
    sodium: 'Sodium',
    zinc: 'Zinc',
    saturatedFat: 'Saturated Fat',
    cholesterol: 'Cholesterol',
    fiber: 'Fiber'
  };
  return names[nutrient] || nutrient.charAt(0).toUpperCase() + nutrient.slice(1);
};

const generateFindings = (totalNutrition, avgDays) => {
  const findings = [];
  
  Object.entries(totalNutrition).forEach(([nutrient, total]) => {
    if (DAILY_VALUES[nutrient]) {
      const avg = total / avgDays;
      const target = DAILY_VALUES[nutrient];
      const percentage = (avg / target) * 100;
      
      if (percentage < 50) {
        findings.push(`⚠️ ${formatNutrientName(nutrient)} intake is significantly below recommended levels (${Math.round(percentage)}% of target)`);
      } else if (percentage > 150 && ['sodium', 'saturatedFat', 'cholesterol'].includes(nutrient)) {
        findings.push(`⚠️ ${formatNutrientName(nutrient)} intake is above recommended limits (${Math.round(percentage)}% of limit)`);
      } else if (percentage >= 90 && percentage <= 110) {
        findings.push(`✅ ${formatNutrientName(nutrient)} intake is well balanced (${Math.round(percentage)}% of target)`);
      }
    }
  });
  
  if (findings.length === 0) {
    findings.push('Overall nutrition profile appears balanced based on tracked data');
  }
  
  return findings;
};

// Download function for browser
export const downloadFile = (content, filename, type = 'text/plain') => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
