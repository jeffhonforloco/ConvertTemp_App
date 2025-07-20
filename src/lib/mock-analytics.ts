// Mock analytics storage and dashboard data
// This will be replaced with Supabase when integrated

export interface ConversionLog {
  id: string;
  fromUnit: string;
  toUnit: string;
  fromValue: number;
  toValue: number;
  method: 'manual' | 'smart_input';
  timestamp: number;
  userId: string;
  sessionId: string;
  userAgent?: string;
  locale?: string;
  ip?: string; // Will be populated by backend
}

export interface AnalyticsSummary {
  totalConversions: number;
  totalUsers: number;
  totalSessions: number;
  mostUsedUnits: { unit: string; count: number }[];
  conversionsToday: number;
  conversionsThisMonth: number;
  conversionsByDay: { date: string; count: number }[];
  popularConversions: { from: string; to: string; count: number }[];
}

class MockAnalyticsStorage {
  private readonly STORAGE_KEY = 'converttemp_analytics_logs';
  private readonly SUMMARY_KEY = 'converttemp_analytics_summary';

  // Store conversion log
  logConversion(data: Omit<ConversionLog, 'id' | 'timestamp'>) {
    const log: ConversionLog = {
      ...data,
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };

    const logs = this.getConversionLogs();
    logs.push(log);
    
    // Keep only last 1000 logs in localStorage
    if (logs.length > 1000) {
      logs.splice(0, logs.length - 1000);
    }
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(logs));
    this.updateSummary();
  }

  // Get all conversion logs
  getConversionLogs(): ConversionLog[] {
    try {
      const logs = localStorage.getItem(this.STORAGE_KEY);
      return logs ? JSON.parse(logs) : [];
    } catch {
      return [];
    }
  }

  // Get analytics summary
  getAnalyticsSummary(): AnalyticsSummary {
    try {
      const summary = localStorage.getItem(this.SUMMARY_KEY);
      if (summary) {
        return JSON.parse(summary);
      }
    } catch {
      // Fall through to generate fresh summary
    }
    
    // Generate summary from logs if not cached
    return this.generateSummary();
  }

  // Update summary cache
  private updateSummary() {
    const summary = this.generateSummary();
    localStorage.setItem(this.SUMMARY_KEY, JSON.stringify(summary));
  }

  // Generate analytics summary from logs
  private generateSummary(): AnalyticsSummary {
    const logs = this.getConversionLogs();
    const now = Date.now();
    const today = new Date().toDateString();
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();

    // Count unique users and sessions
    const uniqueUsers = new Set(logs.map(log => log.userId)).size;
    const uniqueSessions = new Set(logs.map(log => log.sessionId)).size;

    // Count conversions today
    const conversionsToday = logs.filter(log => 
      new Date(log.timestamp).toDateString() === today
    ).length;

    // Count conversions this month
    const conversionsThisMonth = logs.filter(log => {
      const logDate = new Date(log.timestamp);
      return logDate.getMonth() === thisMonth && logDate.getFullYear() === thisYear;
    }).length;

    // Most used units
    const unitCounts: Record<string, number> = {};
    logs.forEach(log => {
      unitCounts[log.fromUnit] = (unitCounts[log.fromUnit] || 0) + 1;
    });
    const mostUsedUnits = Object.entries(unitCounts)
      .map(([unit, count]) => ({ unit, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);

    // Conversions by day (last 7 days)
    const conversionsByDay: { date: string; count: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      const count = logs.filter(log => {
        const logDate = new Date(log.timestamp).toISOString().split('T')[0];
        return logDate === dateStr;
      }).length;
      conversionsByDay.push({ date: dateStr, count });
    }

    // Popular conversion pairs
    const conversionPairs: Record<string, number> = {};
    logs.forEach(log => {
      const pair = `${log.fromUnit}-${log.toUnit}`;
      conversionPairs[pair] = (conversionPairs[pair] || 0) + 1;
    });
    const popularConversions = Object.entries(conversionPairs)
      .map(([pair, count]) => {
        const [from, to] = pair.split('-');
        return { from, to, count };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalConversions: logs.length,
      totalUsers: uniqueUsers,
      totalSessions: uniqueSessions,
      mostUsedUnits,
      conversionsToday,
      conversionsThisMonth,
      conversionsByDay,
      popularConversions,
    };
  }

  // Clear all analytics data
  clearData() {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.SUMMARY_KEY);
  }

  // Export data for backup/migration
  exportData() {
    return {
      logs: this.getConversionLogs(),
      summary: this.getAnalyticsSummary(),
      exportedAt: new Date().toISOString(),
    };
  }
}

export const mockAnalytics = new MockAnalyticsStorage();
