import { useState } from "react";
import { Key } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AdminPasswordResetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  memberNumber: string;
  memberName: string;
}

type PasswordResetResponse = {
  success: boolean;
  message?: string;
  error?: string;
  code?: string;
  details?: {
    timestamp: string;
    [key: string]: any;
  };
}

const AdminPasswordResetDialog = ({
  open,
  onOpenChange,
  memberNumber,
  memberName,
}: AdminPasswordResetDialogProps) => {
  const [isResetting, setIsResetting] = useState(false);

  const handleReset = async () => {
    try {
      setIsResetting(true);
      console.log("[AdminPasswordReset] Starting password reset process", {
        memberNumber,
        memberName,
        timestamp: new Date().toISOString()
      });

      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user?.id) {
        console.error("[AdminPasswordReset] Admin user ID not found");
        throw new Error("Admin user ID not found");
      }

      console.log("[AdminPasswordReset] Admin user verified", {
        adminUserId: userData.user.id,
        timestamp: new Date().toISOString()
      });

      // Call RPC function with individual parameters
      const { data, error } = await supabase.rpc('handle_password_reset', 
        memberNumber,           // member_number
        memberNumber,           // new_password (using member number as temporary password)
        userData.user.id,       // admin_user_id
        window.location.hostname, // ip_address
        navigator.userAgent,    // user_agent
        JSON.stringify({        // client_info
          platform: navigator.platform,
          language: navigator.language,
          timestamp: new Date().toISOString()
        })
      );

      console.log("[AdminPasswordReset] RPC call completed", {
        hasData: !!data,
        hasError: !!error,
        timestamp: new Date().toISOString()
      });

      if (error) {
        console.error("[AdminPasswordReset] Error details:", {
          error: error.message,
          code: error.code,
          hint: error.hint,
          details: error.details,
          timestamp: new Date().toISOString()
        });
        throw error;
      }

      const response = data as PasswordResetResponse;
      
      if (!response?.success) {
        console.error("[AdminPasswordReset] Reset failed", {
          response,
          timestamp: new Date().toISOString()
        });
        throw new Error(response?.message || "Password reset failed");
      }

      console.log("[AdminPasswordReset] Reset successful", {
        memberNumber,
        memberName,
        timestamp: new Date().toISOString()
      });

      toast.success("Password has been reset", {
        description: `Temporary password for ${memberName} is: ${memberNumber}`
      });

      onOpenChange(false);
    } catch (error: any) {
      console.error("[AdminPasswordReset] Error:", {
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      
      toast.error("Failed to reset password", {
        description: error.message
      });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md bg-dashboard-card border border-dashboard-cardBorder">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-dashboard-accent1 flex items-center gap-2">
            <Key className="w-5 h-5" />
            Reset Member Password
          </DialogTitle>
          <div className="text-sm text-dashboard-text mt-2">
            <p className="mb-1">Member: <span className="font-medium">{memberName}</span></p>
            <p>Member Number: <span className="font-medium">{memberNumber}</span></p>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="bg-yellow-500/10 text-yellow-500 p-4 rounded-lg">
            <p className="text-sm">
              This will reset the member's password to their member number. 
              They will be required to change it on their next login.
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="bg-dashboard-card hover:bg-dashboard-cardHover"
            >
              Cancel
            </Button>
            <Button
              onClick={handleReset}
              disabled={isResetting}
              className="bg-dashboard-accent1 hover:bg-dashboard-accent1/80"
            >
              {isResetting ? "Resetting..." : "Reset Password"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminPasswordResetDialog;