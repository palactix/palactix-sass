// app/dashboard/page.tsx
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import ThemeToggle from "@/components/ThemeToggle";


const recentPosts = [
    { id: 1, clientName: "Nike", platform: "instagram", time: "2 hours ago" },
    { id: 2, clientName: "Adidas", platform: "tiktok", time: "5 hours ago" },
    { id: 3, clientName: "Coca Cola", platform: "linkedin", time: "1 day ago" },
    { id: 4, clientName: "Tesla", platform: "x", time: "2 days ago" },
  ];

  const ActivityFeed = () => (
    <div className="space-y-4">
      {recentPosts.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No recent activity</p>
      ) : (
        recentPosts.map((post) => (
          <div key={post.id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                {post.platform[0].toUpperCase()}
              </div>
              <div>
                <p className="font-medium">{post.clientName}</p>
                <p className="text-sm text-gray-400">Posted {post.time}</p>
              </div>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-green-500/20 text-green-400">Success</span>
          </div>
        ))
      )}
    </div>
  );


const StatCard = ({ title, value, color = "text-white", badge }: any) => (
    <div className="bg-[#161b22] border border-white/10 rounded-xl p-6">
      <p className="text-sm text-gray-400">{title}</p>
      <p className={`text-4xl font-bold mt-2 ${color}`}>{value}</p>
      {badge && <p className="text-xs text-amber-400 mt-2">{badge}</p>}
    </div>
  );

export default function Dashboard() {
  // Mock data — replace with real API later
  const user = { name: "Alex Rivera", agencyName: "Rivera Social", plan: "Pro", trial: false };
  

  
  return (
    <div className="min-h-screen bg-[#0c0d0e] text-[#E5E5E5]">
      {/* Fixed Top Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#0c0d0e]/90 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-10">
            <h1 className="text-2xl font-bold">Palactix</h1>
            <nav className="hidden md:flex gap-8">
              <a href="/dashboard" className="text-sm font-medium text-white">Dashboard</a>
              <a href="/scheduler" className="text-sm font-medium text-gray-400 hover:text-[#2ea44f] transition">Scheduler</a>
              <a href="/clients" className="text-sm font-medium text-gray-400 hover:text-[#2ea44f] transition">Clients</a>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:block text-xs text-gray-400">{user.agencyName}</span>
            {/* <ThemeToggle /> */}
            
            {/* Avatar Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-gradient-to-tr from-purple-500 to-pink-500 text-white font-bold">
                      {user.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 mr-4" align="end">
                <DropdownMenuItem className="flex-col items-start">
                  <div className="font-medium">{user.name}</div>
                  <div className="text-xs text-gray-500">{user.agencyName}</div>
                </DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem className="text-red-400">Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Welcome */}
          <div className="mb-10">
            <h2 className="text-3xl font-bold">Welcome back, {user.name}</h2>
            <p className="text-gray-400 mt-2">Here’s what’s happening with your clients today.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <StatCard title="Total Clients" value="47" />
            <StatCard title="Posts This Month" value="312" color="text-[#2ea44f]" />
            <StatCard title="Scheduled" value="89" color="text-amber-400" />
            <StatCard 
              title="Current Plan" 
              value={user.plan} 
              badge={user.trial ? "Trial ends in 9 days" : null} 
            />
          </div>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Activity */}
            <div className="lg:col-span-2">
              <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
              <div className="bg-[#161b22] border border-white/10 rounded-xl p-6">
                <ActivityFeed />
              </div>
            </div>

            {/* Quick Actions + Plan */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-4">
                <Button asChild className="w-full bg-[#2ea44f] hover:bg-[#2ea44f]/90 text-white py-6 text-lg">
                  <a href="/scheduler">+ New Post</a>
                </Button>
                <Button asChild variant="outline" className="w-full border-white/20 text-white py-6 text-lg">
                  <a href="/clients/new">Connect New Client</a>
                </Button>
                <Button asChild variant="outline" className="w-full border-white/20 text-white py-6 text-lg">
                  <a href="/clients">View All Clients</a>
                </Button>
              </div>

              {/* Plan Summary */}
              <div className="mt-8 bg-gradient-to-br from-[#2ea44f]/20 to-transparent border border-[#2ea44f]/30 rounded-xl p-6">
                <p className="text-sm text-gray-400">Current Plan</p>
                <p className="text-2xl font-bold mt-1">{user.plan}</p>
                <p className="text-sm text-gray-400 mt-2">
                  {user.plan === "Pro" ? "Unlimited clients • Custom domain" : "50 clients • 5 team seats"}
                </p>
                <Button variant="outline" size="sm" className="mt-4 w-full border-white/30">
                  Manage Billing
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}