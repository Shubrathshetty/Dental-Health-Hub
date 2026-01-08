import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Shield, Eye, EyeOff } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface AdminLoginProps {
  onBack: () => void;
  onLogin: (adminId: string) => void;
}

const AdminLogin = ({ onBack, onLogin }: AdminLoginProps) => {
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fixed admin ID
  useState(() => {
    setAdminId('ADMIN001');
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check credentials (password is hardcoded for demo - in real app, this would be secure)
    if (password === "Dentcare@123") {
      toast({
        title: "Login Successful",
        description: `Welcome, ${adminId}`,
      });
      onLogin(adminId);
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid password. Please try again.",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  const copyAdminId = () => {
    navigator.clipboard.writeText(adminId);
    toast({
      title: "Copied!",
      description: "Admin ID copied to clipboard",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-scale-in">
        <div className="bg-card rounded-2xl p-8 shadow-elevated border border-border text-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-primary" />
          </div>

          <h1 className="text-2xl font-display font-bold text-foreground mb-2">
            Admin Login
          </h1>
          <p className="text-muted-foreground mb-8">
            Enter your credentials to access the admin dashboard
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="adminId" className="text-sm font-medium text-black">
                Admin ID
              </Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="adminId"
                  type="text"
                  value={adminId}
                  readOnly
                  className="flex-1 font-mono"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={copyAdminId}
                  className="px-3"
                >
                  Copy
                </Button>
              </div>
              <p className="text-xs text-black mt-1">
                Your unique admin ID has been generated
              </p>
            </div>

            <div>
              <Label htmlFor="password" className="text-sm font-medium text-black">
                Password
              </Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-black hover:text-black"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-black hover:text-black"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Role Selection
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
