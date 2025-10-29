import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../shared/ui/card';
import { Button } from '../../../shared/ui/button';
import { Badge } from '../../../shared/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../shared/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../shared/ui/select';
import {
  Users,
  TrendingUp,
  DollarSign,
  Calendar,
  Award,
  BarChart3,
  Download,
  PieChart,
} from 'lucide-react';
import { getPlatformAnalytics, exportAnalyticsReport } from '../api.js';

export default function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState('30d');
  const [analyticsData, setAnalyticsData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      const data = await getPlatformAnalytics(timeRange, 'all');
      setAnalyticsData(data);
    } catch (error) {
      console.error('Failed to load analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = async () => {
    setLoading(true);
    try {
      const result = await exportAnalyticsReport(timeRange, 'pdf');
      if (result.success) {
        alert(`Report generated: ${result.downloadUrl}`);
      }
    } catch (error) {
      console.error('Failed to export report:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Platform Analytics Dashboard</CardTitle>
              <CardDescription>
                Comprehensive insights into platform performance and user behavior
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={handleDownloadReport} disabled={loading}>
                <Download className="h-4 w-4 mr-2" />
                {loading ? 'Generating...' : 'Export Report'}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="engagement">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="loyalty">Loyalty</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
          <TabsTrigger value="retention">Retention</TabsTrigger>
        </TabsList>

        {/* User Engagement Tab */}
        <TabsContent value="engagement" className="space-y-6">
          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Total Users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <div>{analyticsData.totalUsers?.toLocaleString() || '12,453'}</div>
                  <Badge variant="secondary" className="text-xs">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +18%
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Daily Active Users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <div>3,247</div>
                  <Badge variant="secondary" className="text-xs">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12%
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>New Signups</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <div>847</div>
                  <span className="text-xs text-gray-500">this month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Avg Session Duration</CardDescription>
              </CardHeader>
              <CardContent>
                <div>8m 42s</div>
                <p className="text-xs text-gray-500 mt-1">+15% from last month</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>User Activity Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-around gap-2 p-4">
                {[65, 59, 80, 81, 56, 75, 88].map((height, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full bg-purple-600 rounded-t min-h-[20px]"
                      style={{ height: `${Math.max(height, 20)}%` }}
                    />
                    <span className="text-xs text-gray-500">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Features Used</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { feature: 'Booking', usage: 87 },
                  { feature: 'Reviews', usage: 65 },
                  { feature: 'Loyalty Program', usage: 54 },
                  { feature: 'Shop', usage: 42 },
                  { feature: 'Scheduling', usage: 38 },
                ].map((item) => (
                  <div key={item.feature}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">{item.feature}</span>
                      <span className="text-sm text-gray-600">{item.usage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full"
                        style={{ width: `${item.usage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Segments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p>Customers</p>
                      <p className="text-xs text-gray-500">Regular users booking services</p>
                    </div>
                    <Badge>9,847</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p>Salon Owners</p>
                      <p className="text-xs text-gray-500">Business accounts</p>
                    </div>
                    <Badge>2,156</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p>Barbers</p>
                      <p className="text-xs text-gray-500">Service providers</p>
                    </div>
                    <Badge>450</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Appointments Tab */}
        <TabsContent value="appointments" className="space-y-6">
          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Total Appointments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <div>45,678</div>
                  <Badge variant="secondary" className="text-xs">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +24%
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Completion Rate</CardDescription>
              </CardHeader>
              <CardContent>
                <div>94.2%</div>
                <p className="text-xs text-gray-500 mt-1">Above industry avg</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Cancellation Rate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-red-600">5.8%</div>
                <p className="text-xs text-gray-500 mt-1">Within acceptable range</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Avg Booking Lead Time</CardDescription>
              </CardHeader>
              <CardContent>
                <div>3.2 days</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Peak Booking Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-around gap-1 p-4">
                {[12, 15, 22, 45, 65, 88, 92, 85, 78, 68, 52, 38].map((height, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full bg-blue-600 rounded-t min-h-[10px]"
                      style={{ height: `${Math.max(height, 10)}%` }}
                    />
                    <span className="text-xs text-gray-500">{i + 9}:00</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Popular Services</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { service: 'Haircut', bookings: 18453 },
                  { service: 'Hair Coloring', bookings: 12847 },
                  { service: 'Beard Trim', bookings: 8932 },
                  { service: 'Styling', bookings: 5446 },
                ].map((item) => (
                  <div
                    key={item.service}
                    className="flex justify-between items-center p-3 border rounded-lg"
                  >
                    <span>{item.service}</span>
                    <Badge>{item.bookings.toLocaleString()} bookings</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Appointment Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm mb-1">Weekday vs Weekend</p>
                    <div className="flex gap-2">
                      <div className="flex-1 p-3 bg-blue-100 rounded text-center">
                        <p>72%</p>
                        <p className="text-xs text-gray-600">Weekday</p>
                      </div>
                      <div className="flex-1 p-3 bg-purple-100 rounded text-center">
                        <p>28%</p>
                        <p className="text-xs text-gray-600">Weekend</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm mb-1">Booking Method</p>
                    <div className="flex gap-2">
                      <div className="flex-1 p-3 bg-green-100 rounded text-center">
                        <p>89%</p>
                        <p className="text-xs text-gray-600">Online</p>
                      </div>
                      <div className="flex-1 p-3 bg-gray-100 rounded text-center">
                        <p>11%</p>
                        <p className="text-xs text-gray-600">Walk-in</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Revenue Tab */}
        <TabsContent value="revenue" className="space-y-6">
          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Total Revenue
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <div>$1.2M</div>
                  <Badge variant="secondary" className="text-xs">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +32%
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Avg Transaction Value</CardDescription>
              </CardHeader>
              <CardContent>
                <div>$67.50</div>
                <p className="text-xs text-gray-500 mt-1">+8% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Platform Fee Revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <div>$84,500</div>
                <p className="text-xs text-gray-500 mt-1">7% of total</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Top Earning Salon</CardDescription>
              </CardHeader>
              <CardContent>
                <div>Elite Studio</div>
                <p className="text-xs text-gray-500 mt-1">$38,450 this month</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Revenue by Salon Performance Tier</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p>Top Performers</p>
                    <Badge>15%</Badge>
                  </div>
                  <p>$540K</p>
                  <p className="text-xs text-gray-500 mt-1">45% of total revenue</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p>Mid-tier Salons</p>
                    <Badge variant="secondary">45%</Badge>
                  </div>
                  <p>$480K</p>
                  <p className="text-xs text-gray-500 mt-1">40% of total revenue</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p>Growing Salons</p>
                    <Badge variant="secondary">40%</Badge>
                  </div>
                  <p>$180K</p>
                  <p className="text-xs text-gray-500 mt-1">15% of total revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Loyalty Tab */}
        <TabsContent value="loyalty" className="space-y-6">
          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Active Members
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <div>8,234</div>
                  <Badge variant="secondary" className="text-xs">
                    66% of users
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Points Earned</CardDescription>
              </CardHeader>
              <CardContent>
                <div>1.2M</div>
                <p className="text-xs text-gray-500 mt-1">This month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Points Redeemed</CardDescription>
              </CardHeader>
              <CardContent>
                <div>847K</div>
                <p className="text-xs text-gray-500 mt-1">71% redemption rate</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Avg Points per User</CardDescription>
              </CardHeader>
              <CardContent>
                <div>146</div>
                <p className="text-xs text-gray-500 mt-1">Active balance</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Program Effectiveness</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Repeat Visit Rate</p>
                  <p>78%</p>
                  <p className="text-xs text-gray-500 mt-1">+12% since loyalty launch</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Avg Visits per Member</p>
                  <p>4.2</p>
                  <p className="text-xs text-gray-500 mt-1">vs 2.1 for non-members</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Revenue from Members</p>
                  <p>$892K</p>
                  <p className="text-xs text-gray-500 mt-1">74% of total revenue</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Popular Rewards</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { reward: '$5 discount', redeemed: 3245 },
                  { reward: '$10 discount', redeemed: 1876 },
                  { reward: 'Free product', redeemed: 892 },
                  { reward: 'VIP membership', redeemed: 234 },
                ].map((item) => (
                  <div
                    key={item.reward}
                    className="flex justify-between items-center p-3 border rounded-lg"
                  >
                    <span>{item.reward}</span>
                    <Badge>{item.redeemed} redeemed</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Demographics Tab */}
        <TabsContent value="demographics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Demographics Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-3">Age Distribution</p>
                  <div className="space-y-2">
                    {[
                      { range: '18-24', percent: 22 },
                      { range: '25-34', percent: 38 },
                      { range: '35-44', percent: 25 },
                      { range: '45-54', percent: 12 },
                      { range: '55+', percent: 3 },
                    ].map((item) => (
                      <div key={item.range}>
                        <div className="flex justify-between mb-1">
                          <span className="text-xs">{item.range}</span>
                          <span className="text-xs text-gray-600">{item.percent}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-purple-600 h-2 rounded-full"
                            style={{ width: `${item.percent}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-3">Gender Split</p>
                  <div className="space-y-3">
                    <div className="p-4 border rounded-lg text-center">
                      <p>54%</p>
                      <p className="text-xs text-gray-600 mt-1">Female</p>
                    </div>
                    <div className="p-4 border rounded-lg text-center">
                      <p>44%</p>
                      <p className="text-xs text-gray-600 mt-1">Male</p>
                    </div>
                    <div className="p-4 border rounded-lg text-center">
                      <p>2%</p>
                      <p className="text-xs text-gray-600 mt-1">Other/Unspecified</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-3">Top Locations</p>
                  <div className="space-y-2">
                    {[
                      { city: 'New York', users: 3245 },
                      { city: 'Los Angeles', users: 2876 },
                      { city: 'Chicago', users: 1892 },
                      { city: 'Houston', users: 1234 },
                      { city: 'Phoenix', users: 987 },
                    ].map((item) => (
                      <div
                        key={item.city}
                        className="flex justify-between items-center p-2 border rounded"
                      >
                        <span className="text-sm">{item.city}</span>
                        <Badge variant="secondary">{item.users}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Retention Tab */}
        <TabsContent value="retention" className="space-y-6">
          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Overall Retention Rate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <div>82%</div>
                  <Badge variant="secondary" className="text-xs">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +5%
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Churn Rate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-red-600">18%</div>
                <p className="text-xs text-gray-500 mt-1">Down from 23%</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Avg Customer Lifetime</CardDescription>
              </CardHeader>
              <CardContent>
                <div>8.2 months</div>
                <p className="text-xs text-gray-500 mt-1">Increasing trend</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Customer LTV</CardDescription>
              </CardHeader>
              <CardContent>
                <div>$542</div>
                <p className="text-xs text-gray-500 mt-1">Average lifetime value</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Retention Cohort Analysis</CardTitle>
              <CardDescription>
                Percentage of users still active after signup
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Cohort</th>
                      <th className="text-center p-2">Month 1</th>
                      <th className="text-center p-2">Month 3</th>
                      <th className="text-center p-2">Month 6</th>
                      <th className="text-center p-2">Month 12</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { month: 'Jan 2025', m1: 100, m3: 78, m6: 65, m12: 54 },
                      { month: 'Dec 2024', m1: 100, m3: 82, m6: 71, m12: 62 },
                      { month: 'Nov 2024', m1: 100, m3: 85, m6: 75, m12: 68 },
                      { month: 'Oct 2024', m1: 100, m3: 79, m6: 68, m12: 58 },
                    ].map((row) => (
                      <tr key={row.month} className="border-b">
                        <td className="p-2">{row.month}</td>
                        <td className="text-center p-2">
                          <Badge>{row.m1}%</Badge>
                        </td>
                        <td className="text-center p-2">
                          <Badge variant="secondary">{row.m3}%</Badge>
                        </td>
                        <td className="text-center p-2">
                          <Badge variant="secondary">{row.m6}%</Badge>
                        </td>
                        <td className="text-center p-2">
                          <Badge variant="secondary">{row.m12}%</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Satisfaction Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Average Rating</p>
                  <p>4.7 / 5.0</p>
                  <p className="text-xs text-gray-500 mt-1">Based on 12,453 reviews</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">NPS Score</p>
                  <p>68</p>
                  <p className="text-xs text-gray-500 mt-1">Excellent range</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Recommendation Rate</p>
                  <p>89%</p>
                  <p className="text-xs text-gray-500 mt-1">Would recommend to others</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
