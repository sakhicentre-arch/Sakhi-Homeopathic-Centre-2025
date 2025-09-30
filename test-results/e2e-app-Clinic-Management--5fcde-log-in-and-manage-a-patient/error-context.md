# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - button "Open Next.js Dev Tools" [ref=e7] [cursor=pointer]:
    - img [ref=e8] [cursor=pointer]
  - alert [ref=e11]
  - generic [ref=e13]:
    - heading "Admin Login" [level=2] [ref=e14]
    - generic [ref=e15]:
      - generic [ref=e16]:
        - generic [ref=e17]: Email address
        - textbox "Email address" [ref=e18]: testuser_1758983829383@example.com
      - generic [ref=e19]:
        - generic [ref=e20]: Password
        - textbox "Password" [ref=e21]: Password123!
        - link "Forgot your password?" [ref=e23] [cursor=pointer]:
          - /url: /admin/forgot-password
      - button "Signing in..." [disabled] [ref=e25]
      - paragraph [ref=e26]:
        - text: Don't have an account?
        - link "Register here" [ref=e27] [cursor=pointer]:
          - /url: /admin/register
```