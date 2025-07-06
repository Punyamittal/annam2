import React, { useState, useEffect } from 'react';
import { CheckSquare, Square, AlertCircle, Clock, Leaf } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  category: string;
}

interface TaskListProps {
  currentStage: { code: string; stage: any } | null;
  parameters: {
    temperature: number;
    fertilizer: number;
    water: number;
    humidity: number;
    windSpeed: number;
  };
}

const TaskList: React.FC<TaskListProps> = ({ currentStage, parameters }) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  // Regenerate tasks whenever the current stage or parameters change
  useEffect(() => {
    if (currentStage) {
      const newTasks = generateTasks(currentStage, parameters);
      setTasks(newTasks);
    } else {
      setTasks([]);
    }
  }, [currentStage, parameters]);

  const toggleTask = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-100 border-green-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertCircle className="w-4 h-4" />;
      case 'medium': return <Clock className="w-4 h-4" />;
      case 'low': return <Leaf className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Daily Tasks</h2>
        <div className="text-sm text-gray-600">
          {completedTasks}/{totalTasks} completed
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}%` }}
          ></div>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Leaf className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p>No tasks available for current stage</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div 
              key={task.id}
              className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                task.completed 
                  ? 'bg-gray-50 border-gray-200 opacity-60' 
                  : 'bg-white border-gray-200 hover:border-green-300'
              }`}
            >
              <div className="flex items-start space-x-3">
                <button
                  onClick={() => toggleTask(task.id)}
                  className="mt-1 text-green-600 hover:text-green-700 transition-colors"
                >
                  {task.completed ? (
                    <CheckSquare className="w-5 h-5" />
                  ) : (
                    <Square className="w-5 h-5" />
                  )}
                </button>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                      {task.title}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                      <div className="flex items-center space-x-1">
                        {getPriorityIcon(task.priority)}
                        <span>{task.priority.toUpperCase()}</span>
                      </div>
                    </span>
                  </div>
                  <p className={`text-sm ${task.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                    {task.description}
                  </p>
                  <div className="mt-2">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {task.category}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary */}
      {tasks.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-red-600">
                {tasks.filter(t => t.priority === 'high' && !t.completed).length}
              </div>
              <div className="text-xs text-gray-600">High Priority</div>
            </div>
            <div>
              <div className="text-lg font-bold text-yellow-600">
                {tasks.filter(t => t.priority === 'medium' && !t.completed).length}
              </div>
              <div className="text-xs text-gray-600">Medium Priority</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-600">
                {tasks.filter(t => t.priority === 'low' && !t.completed).length}
              </div>
              <div className="text-xs text-gray-600">Low Priority</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Generate tasks based on current stage and parameters
function generateTasks(currentStage: { code: string; stage: any }, parameters: any): Task[] {
  const tasks: Task[] = [];
  const stageType = currentStage.stage.stage_type;
  const bbchCode = parseInt(currentStage.code);

  // Create unique task IDs based on stage and parameters to ensure fresh tasks
  const taskIdPrefix = `${currentStage.code}-${Date.now()}`;

  // Base tasks for all stages
  tasks.push({
    id: `${taskIdPrefix}-monitor`,
    title: 'Monitor Plant Health',
    description: 'Check for signs of disease, pests, or nutrient deficiencies',
    priority: 'high',
    completed: false,
    category: 'Monitoring'
  });

  // Stage-specific tasks
  switch (stageType) {
    case 'germination':
      tasks.push(
        {
          id: `${taskIdPrefix}-water-germination`,
          title: 'Maintain Soil Moisture',
          description: 'Keep soil consistently moist but not waterlogged for optimal germination',
          priority: 'high',
          completed: false,
          category: 'Irrigation'
        },
        {
          id: `${taskIdPrefix}-temp-germination`,
          title: 'Monitor Soil Temperature',
          description: 'Ensure soil temperature is optimal for seed germination',
          priority: 'medium',
          completed: false,
          category: 'Environment'
        }
      );
      break;

    case 'leaf_development':
      tasks.push(
        {
          id: `${taskIdPrefix}-fertilizer-early`,
          title: 'Apply Starter Fertilizer',
          description: 'Apply nitrogen-rich fertilizer to support early leaf development',
          priority: 'high',
          completed: false,
          category: 'Nutrition'
        },
        {
          id: `${taskIdPrefix}-weed-control`,
          title: 'Weed Control',
          description: 'Remove weeds that compete with young plants for nutrients',
          priority: 'medium',
          completed: false,
          category: 'Management'
        }
      );
      break;

    case 'tillering':
      tasks.push(
        {
          id: `${taskIdPrefix}-nitrogen-tillering`,
          title: 'Nitrogen Application',
          description: 'Apply nitrogen fertilizer to support tiller development',
          priority: 'high',
          completed: false,
          category: 'Nutrition'
        }
      );
      break;

    case 'stem_elongation':
      tasks.push(
        {
          id: `${taskIdPrefix}-support-stems`,
          title: 'Provide Plant Support',
          description: 'Install stakes or supports if needed for tall varieties',
          priority: 'medium',
          completed: false,
          category: 'Management'
        }
      );
      break;

    case 'flowering':
      tasks.push(
        {
          id: `${taskIdPrefix}-pollination`,
          title: 'Monitor Pollination',
          description: 'Ensure adequate pollination conditions and bee activity',
          priority: 'high',
          completed: false,
          category: 'Reproduction'
        },
        {
          id: `${taskIdPrefix}-water-flowering`,
          title: 'Maintain Water Supply',
          description: 'Ensure consistent water supply during critical flowering period',
          priority: 'high',
          completed: false,
          category: 'Irrigation'
        }
      );
      break;

    case 'fruit_development':
      tasks.push(
        {
          id: `${taskIdPrefix}-potassium-fruit`,
          title: 'Apply Potassium',
          description: 'Apply potassium-rich fertilizer to support fruit development',
          priority: 'high',
          completed: false,
          category: 'Nutrition'
        }
      );
      break;

    case 'ripening':
      tasks.push(
        {
          id: `${taskIdPrefix}-harvest-prep`,
          title: 'Prepare for Harvest',
          description: 'Check equipment and plan harvest timing',
          priority: 'medium',
          completed: false,
          category: 'Harvest'
        },
        {
          id: `${taskIdPrefix}-reduce-water`,
          title: 'Reduce Irrigation',
          description: 'Gradually reduce water to promote ripening',
          priority: 'medium',
          completed: false,
          category: 'Irrigation'
        }
      );
      break;
  }

  // Parameter-based tasks
  if (parameters.temperature < 18) {
    tasks.push({
      id: `${taskIdPrefix}-temperature-control`,
      title: 'Temperature Control',
      description: 'Temperature is low. Consider using row covers or other protection methods.',
      priority: 'medium',
      completed: false,
      category: 'Environment'
    });
  }

  if (parameters.windSpeed > 8) {
    tasks.push({
      id: `${taskIdPrefix}-wind-protection`,
      title: 'Wind Protection',
      description: 'High wind speed detected - consider windbreaks or delay fertilizer application.',
      priority: 'medium',
      completed: false,
      category: 'Environment'
    });
  }

  // Soil pH tasks
  if (parameters.soilPh !== undefined) {
    if (parameters.soilPh < 6) {
      tasks.push({
        id: `${taskIdPrefix}-lime-application`,
        title: 'Apply Lime',
        description: 'Soil pH is low. Apply lime to increase soil pH and improve nutrient availability.',
        priority: 'high',
        completed: false,
        category: 'Soil Health'
      });
    } else if (parameters.soilPh > 7.5) {
      tasks.push({
        id: `${taskIdPrefix}-acidify-soil`,
        title: 'Acidify Soil',
        description: 'Soil pH is high. Apply sulfur or organic matter to lower soil pH.',
        priority: 'medium',
        completed: false,
        category: 'Soil Health'
      });
    }
  }

  // Soil Nitrogen tasks
  if (parameters.soilNitrogen !== undefined) {
    if (parameters.soilNitrogen < 20) {
      tasks.push({
        id: `${taskIdPrefix}-add-nitrogen`,
        title: 'Add Nitrogen Fertilizer',
        description: 'Soil nitrogen is low. Apply nitrogen fertilizer to promote healthy growth.',
        priority: 'high',
        completed: false,
        category: 'Nutrition'
      });
    } else if (parameters.soilNitrogen > 80) {
      tasks.push({
        id: `${taskIdPrefix}-monitor-nitrogen`,
        title: 'Monitor Nitrogen Levels',
        description: 'Soil nitrogen is high. Monitor for excessive vegetative growth or leaching.',
        priority: 'medium',
        completed: false,
        category: 'Nutrition'
      });
    }
  }

  return tasks;
}

export default TaskList;