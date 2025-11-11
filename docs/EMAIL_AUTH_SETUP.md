# Email Authentication Setup Guide

## 🔐 Overview

This guide explains how email confirmation and password reset links work in the Salonica application.

---

## 📧 Email Flows

### **1. Email Confirmation (Sign Up)**
1. User signs up with email/password
2. Supabase sends confirmation email
3. User clicks link in email → redirected to `/auth/callback?token=...`
4. Frontend verifies token and redirects to sign-in
5. User can now sign in

### **2. Password Reset**
1. User requests password reset at `/auth/forgot-password`
2. Supabase sends reset email
3. User clicks link in email → redirected to `/auth/callback?type=recovery&token=...`
4. Frontend redirects to `/auth/reset-password?token=...`
5. User sets new password
6. User can sign in with new password

---

## ⚙️ Supabase Configuration

### **Step 1: Configure Redirect URLs**

Go to your Supabase Dashboard:
1. Navigate to **Authentication → URL Configuration**
2. Set these values:

**Site URL:**
```
Development: http://localhost:5173
Production: https://your-production-domain.com
```

**Redirect URLs (add all of these):**
```
http://localhost:5173/auth/callback
http://localhost:5173/auth/reset-password
https://your-production-domain.com/auth/callback
https://your-production-domain.com/auth/reset-password
```

### **Step 2: Email Templates (Optional Customization)**

Navigate to **Authentication → Email Templates** to customize:
- **Confirm signup** - Email sent after registration
- **Reset password** - Email sent when user requests reset

**Template Variables Available:**
- `{{ .ConfirmationURL }}` - Link user clicks to confirm email
- `{{ .Token }}` - Token for verification
- `{{ .SiteURL }}` - Your site URL

---

## 🎯 Frontend Routes

### Routes Created:
| Route | Purpose |
|-------|---------|
| `/auth/callback` | Handles email confirmations and password reset redirects |
| `/auth/reset-password` | Form to set new password (with token) |
| `/auth/forgot-password` | Request password reset email |
| `/auth/sign-in` | Sign in page |
| `/auth/sign-up` | Sign up page |

---

## 🧪 Testing

### **Test Email Confirmation (Stub Mode):**
1. Sign up with any email
2. In stub mode, you'll be auto-logged in
3. Check that the flow works smoothly

### **Test Email Confirmation (Real Mode):**
1. Set `VITE_AUTH_MODE=real` in `.env.local`
2. Sign up with a real email address
3. Check your email for confirmation link
4. Click link → should redirect to `/auth/callback`
5. Should see success message and redirect to sign-in

### **Test Password Reset (Stub Mode):**
1. Go to `/auth/forgot-password`
2. Enter any email
3. Will automatically redirect to reset form with demo token

### **Test Password Reset (Real Mode):**
1. Set `VITE_AUTH_MODE=real` in `.env.local`
2. Go to `/auth/forgot-password`
3. Enter registered email
4. Check email for reset link
5. Click link → redirects to `/auth/callback` → then to `/auth/reset-password`
6. Set new password
7. Sign in with new password

---

## 🔧 Troubleshooting

### **Issue: Email links don't redirect to my app**
**Solution:** Check Supabase URL Configuration
- Make sure Site URL matches your frontend URL exactly
- Add all redirect URLs (dev + production)

### **Issue: "Invalid reset token" error**
**Causes:**
- Token expired (default: 1 hour)
- Token already used
- Invalid token format

**Solution:** Request a new password reset

### **Issue: Email confirmation link broken**
**Check:**
1. Supabase redirect URLs configured correctly
2. `/auth/callback` route exists in frontend
3. Email template uses correct URL format

### **Issue: Not receiving emails**
**Check:**
1. Email in spam folder
2. Supabase email sending quota (free tier limited)
3. Email provider not blocking Supabase emails

---

## 🚀 Production Deployment

### **Before Deploying:**

1. **Update Supabase URL Configuration:**
   ```
   Site URL: https://your-production-domain.com
   Redirect URLs: https://your-production-domain.com/auth/callback
   ```

2. **Update Environment Variables:**
   ```env
   VITE_API=https://your-backend-api.com/api
   VITE_AUTH_MODE=real
   VITE_MOCK=0
   ```

3. **Test the Full Flow:**
   - Sign up with real email
   - Confirm email via link
   - Test password reset
   - Verify all redirects work

---

## 📝 API Endpoints Used

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/auth/signup` | POST | Create new user account |
| `/auth/password-reset/request` | POST | Send password reset email |
| `/auth/password-reset/confirm` | POST | Complete password reset with token |

---

## 🎨 User Experience

### **Email Confirmation Success:**
```
✓ Email confirmed!
  Redirecting to sign in...
```

### **Password Reset Success:**
```
✓ Success!
  Redirecting to reset password...
```

### **Error States:**
- Invalid/expired token → Show error, offer to request new one
- Network error → Show error message, retry button
- Missing token → Redirect to forgot password page

---

## 💡 Tips

1. **Always test email flows in staging before production**
2. **Monitor Supabase auth logs for issues**
3. **Keep email templates professional and branded**
4. **Add rate limiting to prevent spam**
5. **Consider email verification required/optional based on use case**

---

## 🔗 Related Files

- `src/features/auth/pages/AuthCallback.jsx` - Handles email link redirects
- `src/features/auth/pages/ResetPassword.jsx` - Password reset form
- `src/features/auth/pages/ForgotPassword.jsx` - Request reset email
- `src/features/auth/routes.jsx` - Auth route configuration

