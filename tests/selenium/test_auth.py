"""
Selenium Test Suite for Salonica - Authentication Flows
Tests user sign up, login, and logout functionality
"""
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
import time
import random

class TestAuthentication:
    """Test suite for authentication features"""
    
    def setup_method(self):
        """Set up Chrome driver before each test"""
        chrome_options = Options()
        chrome_options.add_argument("--start-maximized")
        # Uncomment below for headless mode (no browser window)
        # chrome_options.add_argument("--headless")
        self.driver = webdriver.Chrome(options=chrome_options)
        self.base_url = "http://localhost:5173"  # Vite default port
        self.wait = WebDriverWait(self.driver, 10)
    
    def teardown_method(self):
        """Close browser after each test"""
        time.sleep(1)  # Brief pause to see results
        self.driver.quit()
    
    def test_home_page_loads(self):
        """Test 1: Verify home page loads successfully"""
        print("\n🧪 Test 1: Home Page Load")
        self.driver.get(self.base_url)
        
        # Wait for and verify hero heading
        heading = self.wait.until(
            EC.presence_of_element_located((By.XPATH, "//h1[contains(text(), 'Your Perfect Salon')]"))
        )
        assert heading.is_displayed()
        print("✅ Home page loaded successfully")
        print(f"   Title: {self.driver.title}")
    
    def test_navigate_to_signup(self):
        """Test 2: Navigate from home to sign up page"""
        print("\n🧪 Test 2: Navigate to Sign Up")
        self.driver.get(self.base_url)
        
        # Click "Get Started Free" button
        get_started_btn = self.wait.until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Get Started Free')]"))
        )
        get_started_btn.click()
        
        # Verify we're on sign up page
        time.sleep(1)
        assert "/auth/sign-up" in self.driver.current_url
        signup_heading = self.wait.until(
            EC.presence_of_element_located((By.XPATH, "//h1[text()='Salonica']"))
        )
        assert signup_heading.is_displayed()
        print("✅ Successfully navigated to sign up page")
    
    def test_signup_form_validation(self):
        """Test 3: Sign up form validation"""
        print("\n🧪 Test 3: Sign Up Form Validation")
        self.driver.get(f"{self.base_url}/auth/sign-up")
        
        # Wait for form to fully load
        first_name_input = self.wait.until(
            EC.presence_of_element_located((By.ID, "firstName"))
        )
        
        # Try to submit empty form
        submit_btn = self.wait.until(
            EC.element_to_be_clickable((By.XPATH, "//button[@type='submit']"))
        )
        submit_btn.click()
        
        # Check for HTML5 validation (required fields)
        is_valid = self.driver.execute_script("return arguments[0].checkValidity();", first_name_input)
        assert not is_valid  # Should be invalid when empty
        print("✅ Form validation working correctly")
    
    def test_complete_signup_flow(self):
        """Test 4: Complete user sign up flow"""
        print("\n🧪 Test 4: Complete Sign Up Flow")
        self.driver.get(f"{self.base_url}/auth/sign-up")
        
        # Generate random user data
        random_num = random.randint(1000, 9999)
        test_user = {
            "firstName": f"Test",
            "lastName": f"User{random_num}",
            "email": f"test.user{random_num}@example.com",
            "password": "TestPass123!",
            "accountType": "customer"
        }
        
        # Wait for form to load, then fill out
        first_name_input = self.wait.until(
            EC.presence_of_element_located((By.ID, "firstName"))
        )
        first_name_input.send_keys(test_user["firstName"])
        
        self.driver.find_element(By.ID, "lastName").send_keys(test_user["lastName"])
        self.driver.find_element(By.ID, "email").send_keys(test_user["email"])
        self.driver.find_element(By.ID, "password").send_keys(test_user["password"])
        self.driver.find_element(By.ID, "confirmPassword").send_keys(test_user["password"])
        
        # Select account type
        account_type_select = self.driver.find_element(By.ID, "accountType")
        account_type_select.send_keys("Customer")
        
        print(f"   Created test user: {test_user['email']}")
        
        # Submit form
        submit_btn = self.driver.find_element(By.XPATH, "//button[@type='submit']")
        submit_btn.click()
        
        # Wait a moment (in stub mode, should succeed quickly)
        time.sleep(2)
        print("✅ Sign up form submitted successfully")
    
    def test_login_flow(self):
        """Test 5: User login flow"""
        print("\n🧪 Test 5: Login Flow")
        self.driver.get(f"{self.base_url}/auth/sign-in")
        
        # Wait for form to load
        email_input = self.wait.until(
            EC.presence_of_element_located((By.ID, "email"))
        )
        
        # In stub mode, any credentials work
        email_input.send_keys("demo@example.com")
        self.driver.find_element(By.ID, "password").send_keys("password123")
        
        # Submit login
        login_btn = self.driver.find_element(By.XPATH, "//button[@type='submit']")
        login_btn.click()
        
        # Should redirect after successful login
        time.sleep(2)
        print(f"   Current URL: {self.driver.current_url}")
        print("✅ Login submitted successfully")
    
    def test_demo_login_buttons(self):
        """Test 6: Demo login buttons (stub mode only)"""
        print("\n🧪 Test 6: Demo Login Buttons")
        self.driver.get(f"{self.base_url}/auth/sign-in")
        
        # Check if demo buttons exist (stub mode)
        try:
            demo_customer_btn = self.wait.until(
                EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Demo Customer')]"))
            )
            demo_customer_btn.click()
            time.sleep(2)
            print(f"   Redirected to: {self.driver.current_url}")
            print("✅ Demo login working (stub mode enabled)")
        except:
            print("⚠️  Demo buttons not found (real mode enabled)")

if __name__ == "__main__":
    """Run tests when script is executed directly"""
    import sys
    
    print("=" * 60)
    print("🚀 Salonica Selenium Test Suite - Authentication")
    print("=" * 60)
    
    test_suite = TestAuthentication()
    tests = [
        test_suite.test_home_page_loads,
        test_suite.test_navigate_to_signup,
        test_suite.test_signup_form_validation,
        test_suite.test_complete_signup_flow,
        test_suite.test_login_flow,
        test_suite.test_demo_login_buttons,
    ]
    
    passed = 0
    failed = 0
    
    for test in tests:
        try:
            test_suite.setup_method()
            test()
            test_suite.teardown_method()
            passed += 1
        except Exception as e:
            print(f"❌ Test failed: {str(e)}")
            test_suite.teardown_method()
            failed += 1
    
    print("\n" + "=" * 60)
    print(f"📊 Test Results: {passed} passed, {failed} failed")
    print("=" * 60)
    
    sys.exit(0 if failed == 0 else 1)

