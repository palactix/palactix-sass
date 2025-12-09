import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { buildOrgUrl } from "@/lib/utils/index"
import { Calendar, CheckCircle2, Clock, MoreHorizontal, Plus, TrendingUp, Users } from "lucide-react"
import Link from "next/link"

const recentPosts = [
  { id: 1, clientName: "Nike", platform: "instagram", time: "2 hours ago", status: "success" },
  { id: 2, clientName: "Adidas", platform: "tiktok", time: "5 hours ago", status: "success" },
  { id: 3, clientName: "Coca Cola", platform: "linkedin", time: "1 day ago", status: "success" },
  { id: 4, clientName: "Tesla", platform: "x", time: "2 days ago", status: "success" },
]

const upcomingPosts = [
  { id: 1, title: "Summer Campaign Launch", time: "Tomorrow, 09:00 AM", duration: "1d 6h 12m" },
  { id: 2, title: "Product Teaser Video", time: "14 Nov 2025, 09:00 AM", duration: "3h 30m" },
  { id: 3, title: "Influencer Collab", time: "15 Nov 2025, 10:00 AM", duration: "5h 15m" },
]

const tasks = [
  { id: 1, title: "Review Nike assets", due: "Today", completed: false },
  { id: 2, title: "Approve Adidas copy", due: "Tomorrow", completed: false },
  { id: 3, title: "Client meeting: Tesla", due: "Mon, 11 Nov", completed: true },
]

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      {/* Welcome Section */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Welcome back, Alex 👋</h2>
          <p className="text-muted-foreground">
            Here&apos;s what&apos;s happening with your clients today.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> New Post
          </Button>
        </div>
      </div>

      {/* Agency App Banner */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
                <h3 className="text-xl font-bold mb-1">Create Your Agency App</h3>
                <p className="text-green-50/90 max-w-xl">
                    Takes 4 minutes. After this, your clients will only see YOUR agency name on Instagram, TikTok, etc. No more third-party branding.
                </p>
            </div>
            <Button size="lg" variant="secondary" className="font-semibold whitespace-nowrap hover:bg-white hover:text-green-700" asChild>
                <Link href={buildOrgUrl('/agency-app')}>Get Started</Link>
            </Button>
        </div>
        {/* Decorative circle */}
        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -left-12 -bottom-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Posts This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">312</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">89</div>
            <p className="text-xs text-muted-foreground">Across 12 clients</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Plan</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Pro</div>
            <p className="text-xs text-muted-foreground">Unlimited Clients</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        
        {/* Activity Feed */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              You have 12 unread notifications from your clients.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {recentPosts.map((post) => (
                <div key={post.id} className="flex items-center">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted border">
                    <span className="text-xs font-bold">{post.platform[0].toUpperCase()}</span>
                  </div>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{post.clientName}</p>
                    <p className="text-xs text-muted-foreground">
                      Posted to {post.platform}
                    </p>
                  </div>
                  <div className="ml-auto font-medium text-xs text-muted-foreground">
                    {post.time}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Right Column Widgets */}
        <div className="col-span-3 space-y-4">
          
          {/* Upcoming Schedule */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Posts</CardTitle>
              <CardDescription>Next 24 hours</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              {upcomingPosts.map((post, i) => (
                <div key={post.id} className={`flex items-center justify-between p-3 rounded-lg border ${i === 0 ? 'bg-muted/50 border-primary/20' : 'bg-background'}`}>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{post.title}</p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="mr-1 h-3 w-3" />
                      {post.time}
                    </div>
                  </div>
                  {i === 0 && (
                     <div className="bg-primary/90 text-primary-foreground text-xs px-2 py-1 rounded">
                       {post.duration}
                     </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Tasks */}
          <Card>
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1">
                    <CardTitle>Project Tasks</CardTitle>
                    <CardDescription>3 pending tasks</CardDescription>
                </div>
                <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {tasks.map((task) => (
                        <div key={task.id} className="flex items-center space-x-2">
                            <div className={`h-4 w-4 rounded border flex items-center justify-center ${task.completed ? 'bg-primary border-primary text-primary-foreground' : 'border-muted-foreground'}`}>
                                {task.completed && <CheckCircle2 className="h-3 w-3" />}
                            </div>
                            <span className={`text-sm ${task.completed ? 'text-muted-foreground line-through' : ''}`}>{task.title}</span>
                            <span className="ml-auto text-xs text-muted-foreground">{task.due}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}