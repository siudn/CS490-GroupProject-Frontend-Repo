# Selenium Test Suite for Salonica

## What is Selenium?
Selenium is a web automation framework that simulates real user interactions to test if your application works correctly. It clicks buttons, fills forms, and navigates pages just like a real user would.

## Why We Use It
- **Automated Testing**: Tests run automatically without manual clicking
- **Quality Assurance**: Catch bugs before users do
- **Regression Testing**: Ensure new features don't break existing functionality
- **Professional Practice**: Industry-standard for web application testing

## Setup Instructions

### 1. Install Python Dependencies
```bash
cd tests/selenium
pip install -r requirements.txt
```

### 2. Install ChromeDriver
**Option A - Automatic (Recommended):**
```bash
pip install webdriver-manager
```

**Option B - Manual:**
1. Download ChromeDriver: https://chromedriver.chromium.org/downloads
2. Match your Chrome browser version
3. Add to your PATH

### 3. Start Your Dev Server
```bash
# In your project root
npm run dev
```
The app should be running on `http://localhost:5173`

## Running Tests

### Run All Authentication Tests
```bash
python test_auth.py
```

### Run All Navigation Tests
```bash
python test_navigation.py
```

### Run with Pytest (Better Output)
```bash
pytest test_auth.py -v
pytest test_navigation.py -v
```

### Run All Tests
```bash
pytest -v
```

## Test Coverage

### `test_auth.py` - Authentication Testing
- ✅ Home page loads correctly
- ✅ Navigation to sign up page
- ✅ Form validation
- ✅ Complete sign up flow
- ✅ Login functionality
- ✅ Demo login buttons (stub mode)

### `test_navigation.py` - UI & Navigation Testing
- ✅ All homepage sections load
- ✅ Search bar interaction
- ✅ Scroll functionality
- ✅ Footer links exist
- ✅ Responsive design (mobile/tablet/desktop)
- ✅ CTA buttons work

## What Happens During Tests

1. **Chrome browser opens automatically**
2. **Tests run one by one**
   - Each test navigates to different pages
   - Clicks buttons, fills forms
   - Verifies elements exist and work
3. **Browser closes after each test**
4. **Results printed to console**

## Tips for Presentation

**If Professor Asks:**
- "We use Selenium for automated end-to-end testing"
- "It simulates real user interactions to catch bugs"
- "Tests run automatically before deployment"
- *Demo: Run `python test_auth.py` and show browser automation*

**To Show Working Tests:**
1. Start your dev server: `npm run dev`
2. Run: `python test_auth.py`
3. Watch the browser open and run tests automatically
4. Point out the passing test output in console

## Common Issues & Fixes

### ChromeDriver Version Mismatch
```bash
pip install webdriver-manager
# Then update test files to use WebDriverManager
```

### Port Already in Use
- Change `self.base_url` in test files to match your dev server port

### Tests Run Too Fast
- Tests have built-in `time.sleep()` delays
- Increase delays to see actions more clearly during demo

### Headless Mode (No Browser Window)
Uncomment this line in test files:
```python
chrome_options.add_argument("--headless")
```

## Expected Output

```
============================================================
🚀 Salonica Selenium Test Suite - Authentication
============================================================

🧪 Test 1: Home Page Load
✅ Home page loaded successfully
   Title: Vite + React

🧪 Test 2: Navigate to Sign Up
✅ Successfully navigated to sign up page

🧪 Test 3: Sign Up Form Validation
✅ Form validation working correctly

🧪 Test 4: Complete Sign Up Flow
   Created test user: test.user1234@example.com
✅ Sign up form submitted successfully

🧪 Test 5: Login Flow
   Current URL: http://localhost:5173/customer/browse
✅ Login submitted successfully

🧪 Test 6: Demo Login Buttons
   Redirected to: http://localhost:5173/customer/browse
✅ Demo login working (stub mode enabled)

============================================================
📊 Test Results: 6 passed, 0 failed
============================================================
```

## Future Enhancements
- Add tests for salon browsing
- Test appointment booking flow
- Test admin verification workflow
- Add screenshot capture on failure
- Integrate with CI/CD pipeline

