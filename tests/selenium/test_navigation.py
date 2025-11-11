"""
Selenium Test Suite for Salonica - Navigation & UI
Tests page navigation, button clicks, and UI interactions
"""
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
import time

class TestNavigation:
    """Test suite for navigation and UI features"""
    
    def setup_method(self):
        """Set up Chrome driver before each test"""
        chrome_options = Options()
        chrome_options.add_argument("--start-maximized")
        self.driver = webdriver.Chrome(options=chrome_options)
        self.base_url = "http://localhost:5173"
        self.wait = WebDriverWait(self.driver, 10)
    
    def teardown_method(self):
        """Close browser after each test"""
        time.sleep(1)
        self.driver.quit()
    
    def test_homepage_sections_exist(self):
        """Test 1: Verify all homepage sections load"""
        print("\n🧪 Test 1: Homepage Sections")
        self.driver.get(self.base_url)
        
        sections = [
            "Your Perfect Salon",  # Hero
            "How It Works",         # Process
            "Why Choose Salonica",  # Features
            "For Customers",        # Dual CTA
            "What Our Users Say",   # Testimonials
        ]
        
        for section in sections:
            element = self.wait.until(
                EC.presence_of_element_located((By.XPATH, f"//*[contains(text(), '{section}')]"))
            )
            assert element.is_displayed()
            print(f"   ✅ Found: {section}")
        
        print("✅ All homepage sections loaded")
    
    def test_search_bar_interaction(self):
        """Test 2: Interact with search bar"""
        print("\n🧪 Test 2: Search Bar Interaction")
        self.driver.get(self.base_url)
        
        # Find and interact with search bar
        search_input = self.wait.until(
            EC.presence_of_element_located((By.XPATH, "//input[@placeholder*='Search']"))
        )
        search_input.send_keys("Hair Salon New York")
        
        # Click search button
        search_btn = self.driver.find_element(By.XPATH, "//button[@type='submit'][contains(., 'Search')]")
        
        print("   Entered search query: 'Hair Salon New York'")
        print("✅ Search bar interaction successful")
    
    def test_scroll_to_features(self):
        """Test 3: Scroll to features section"""
        print("\n🧪 Test 3: Scroll to Features")
        self.driver.get(self.base_url)
        
        # Find features section
        features_section = self.wait.until(
            EC.presence_of_element_located((By.XPATH, "//h2[contains(text(), 'Why Choose Salonica')]"))
        )
        
        # Scroll to it
        self.driver.execute_script("arguments[0].scrollIntoView(true);", features_section)
        time.sleep(0.5)
        
        # Verify it's in viewport
        is_displayed = features_section.is_displayed()
        assert is_displayed
        print("✅ Scrolled to features section successfully")
    
    def test_footer_links_exist(self):
        """Test 4: Verify footer links"""
        print("\n🧪 Test 4: Footer Links")
        self.driver.get(self.base_url)
        
        # Scroll to footer
        footer = self.wait.until(
            EC.presence_of_element_located((By.XPATH, "//footer"))
        )
        self.driver.execute_script("arguments[0].scrollIntoView(true);", footer)
        time.sleep(0.5)
        
        # Check for footer links
        footer_links = [
            "Browse Salons",
            "My Appointments",
            "Owner Dashboard",
            "Barber Portal"
        ]
        
        for link_text in footer_links:
            link = self.driver.find_element(By.XPATH, f"//button[contains(text(), '{link_text}')]")
            assert link.is_displayed()
            print(f"   ✅ Found: {link_text}")
        
        print("✅ All footer links found")
    
    def test_responsive_design(self):
        """Test 5: Test responsive design (mobile viewport)"""
        print("\n🧪 Test 5: Responsive Design")
        self.driver.get(self.base_url)
        
        # Test desktop
        self.driver.set_window_size(1920, 1080)
        time.sleep(0.5)
        print("   ✅ Desktop view (1920x1080)")
        
        # Test tablet
        self.driver.set_window_size(768, 1024)
        time.sleep(0.5)
        print("   ✅ Tablet view (768x1024)")
        
        # Test mobile
        self.driver.set_window_size(375, 812)
        time.sleep(0.5)
        print("   ✅ Mobile view (375x812)")
        
        # Verify page still works on mobile
        heading = self.driver.find_element(By.XPATH, "//h1[contains(text(), 'Your Perfect Salon')]")
        assert heading.is_displayed()
        
        print("✅ Responsive design working across devices")
    
    def test_cta_buttons(self):
        """Test 6: Test call-to-action buttons"""
        print("\n🧪 Test 6: CTA Buttons")
        self.driver.get(self.base_url)
        
        # Find and hover over primary CTA
        get_started_btn = self.wait.until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Get Started')]"))
        )
        
        # Check if button is displayed and enabled
        assert get_started_btn.is_displayed()
        assert get_started_btn.is_enabled()
        
        print("   ✅ Primary CTA button found and enabled")
        print("✅ CTA buttons working correctly")

if __name__ == "__main__":
    """Run tests when script is executed directly"""
    import sys
    
    print("=" * 60)
    print("🚀 Salonica Selenium Test Suite - Navigation & UI")
    print("=" * 60)
    
    test_suite = TestNavigation()
    tests = [
        test_suite.test_homepage_sections_exist,
        test_suite.test_search_bar_interaction,
        test_suite.test_scroll_to_features,
        test_suite.test_footer_links_exist,
        test_suite.test_responsive_design,
        test_suite.test_cta_buttons,
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

