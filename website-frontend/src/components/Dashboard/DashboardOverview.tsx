import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { useApp } from '../../context/AppContext';

const DashboardOverview: React.FC = () => {
  const { projects = [], teams = [], members = [], publications = [] } = useApp();

  // Calculate project status distribution
  const projectStatusCounts = useMemo(() => {
    const counts = {
      planning: 0,
      in_progress: 0,
      completed: 0,
      on_hold: 0
    };
    
    if (!projects || !Array.isArray(projects)) {
      return [
        { value: 0, name: 'In Progress' },
        { value: 0, name: 'Completed' },
        { value: 0, name: 'On Hold' },
        { value: 0, name: 'Planning' }
      ];
    }

    projects.forEach(project => {
      if (project && project.status) {
        counts[project.status]++;
      }
    });
    
    return [
      { value: counts.in_progress, name: 'In Progress' },
      { value: counts.completed, name: 'Completed' },
      { value: counts.on_hold, name: 'On Hold' },
      { value: counts.planning, name: 'Planning' }
    ];
  }, [projects]);

  // Calculate team performance
  const teamPerformanceData = useMemo(() => {
    if (!teams || !Array.isArray(teams)) {
      return {
        teamNames: [],
        projectData: [],
        publicationData: []
      };
    }

    const teamNames = teams.map(team => team?.name || 'Unnamed Team');
    const projectData = teams.map(team => team?.projects?.length || 0);
    const publicationData = teams.map(team => team?.publications?.length || 0);
    
    return { teamNames, projectData, publicationData };
  }, [teams]);

  // Calculate research progress over time (last 6 months)
  const researchProgress = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const publicationsByMonth = new Array(6).fill(0);
    const projectsByMonth = new Array(6).fill(0);

    if (publications && Array.isArray(publications)) {
      publications.forEach(pub => {
        if (pub?.publishDate) {
          const pubDate = new Date(pub.publishDate);
          const monthIndex = pubDate.getMonth();
          if (monthIndex >= 0 && monthIndex < 6) {
            publicationsByMonth[monthIndex]++;
          }
        }
      });
    }

    if (projects && Array.isArray(projects)) {
      projects.forEach(proj => {
        if (proj?.startDate) {
          const startDate = new Date(proj.startDate);
          const monthIndex = startDate.getMonth();
          if (monthIndex >= 0 && monthIndex < 6) {
            projectsByMonth[monthIndex]++;
          }
        }
      });
    }

    return { months, publicationsByMonth, projectsByMonth };
  }, [publications, projects]);

  // Calculate member activity distribution
  const memberActivityData = useMemo(() => {
    const totalMembers = members?.length || 1; // Avoid division by zero
    const activeProjects = projects?.filter(p => p?.status === 'in_progress')?.length || 0;
    const recentPublications = publications?.filter(p => {
      if (!p?.publishDate) return false;
      const pubDate = new Date(p.publishDate);
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      return pubDate >= threeMonthsAgo;
    })?.length || 0;

    return [
      { 
        value: [
          (activeProjects / totalMembers) * 10,
          (recentPublications / totalMembers) * 10,
          ((teams?.length || 0) / totalMembers) * 10,
          ((publications?.length || 0) / totalMembers) * 10,
          ((projects?.length || 0) / totalMembers) * 10
        ], 
        name: 'Current Period'
      }
    ];
  }, [members, projects, publications, teams]);

  // Chart Options
  const projectStatusOption = {
    title: {
      text: 'Project Status Distribution',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'middle'
    },
    series: [
      {
        name: 'Project Status',
        type: 'pie',
        radius: '50%',
        data: projectStatusCounts,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

  const teamPerformanceOption = {
    title: {
      text: 'Team Performance',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['Projects', 'Publications'],
      top: '30'
    },
    xAxis: {
      type: 'category',
      data: teamPerformanceData.teamNames,
      axisLabel: {
        rotate: 30,
        overflow: 'truncate'
      }
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'Projects',
        type: 'bar',
        data: teamPerformanceData.projectData
      },
      {
        name: 'Publications',
        type: 'bar',
        data: teamPerformanceData.publicationData
      }
    ]
  };

  const researchProgressOption = {
    title: {
      text: 'Research Progress Timeline',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['Publications', 'Projects'],
      top: '30'
    },
    xAxis: {
      type: 'category',
      data: researchProgress.months
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'Publications',
        type: 'line',
        data: researchProgress.publicationsByMonth,
        smooth: true
      },
      {
        name: 'Projects',
        type: 'line',
        data: researchProgress.projectsByMonth,
        smooth: true
      }
    ]
  };

  const activityDistributionOption = {
    title: {
      text: 'Research Activity Distribution',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    radar: {
      indicator: [
        { name: 'Active Projects', max: 10 },
        { name: 'Recent Publications', max: 10 },
        { name: 'Team Collaboration', max: 10 },
        { name: 'Publication Impact', max: 10 },
        { name: 'Project Diversity', max: 10 }
      ]
    },
    series: [
      {
        type: 'radar',
        data: memberActivityData
      }
    ]
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Research Lab Overview</h1>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Active Projects</h3>
          <p className="text-3xl font-bold text-blue-600">
            {projects.filter(p => p.status === 'in_progress').length}
          </p>
          <p className="text-sm text-gray-500">
            of {projects.length} total
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Research Teams</h3>
          <p className="text-3xl font-bold text-green-600">{teams.length}</p>
          <p className="text-sm text-gray-500">
            {teams.filter(t => t.status === 'active').length} active
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Team Members</h3>
          <p className="text-3xl font-bold text-purple-600">{members.length}</p>
          <p className="text-sm text-gray-500">
            {members.filter(m => m.type === 'team_leader').length} team leaders
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Publications</h3>
          <p className="text-3xl font-bold text-orange-600">{publications.length}</p>
          <p className="text-sm text-gray-500">
            Last 6 months
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <ReactECharts option={projectStatusOption} style={{ height: '400px' }} />
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <ReactECharts option={teamPerformanceOption} style={{ height: '400px' }} />
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <ReactECharts option={researchProgressOption} style={{ height: '400px' }} />
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <ReactECharts option={activityDistributionOption} style={{ height: '400px' }} />
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview; 