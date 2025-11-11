"""
Run all Selenium tests for Salonica
Quick demo script for presentation
"""
import subprocess
import sys
import time

def run_command(cmd, description):
    """Run a command and display results"""
    print("\n" + "=" * 60)
    print(f"🚀 {description}")
    print("=" * 60)
    
    result = subprocess.run(cmd, shell=True)
    
    if result.returncode == 0:
        print(f"✅ {description} - PASSED")
    else:
        print(f"❌ {description} - FAILED")
    
    return result.returncode == 0

def main():
    print("""
    ╔══════════════════════════════════════════════════════════╗
    ║       SALONICA SELENIUM TEST SUITE - FULL RUN           ║
    ║                                                          ║
    ║  Automated testing for salon booking application        ║
    ║  Tests: Authentication, Navigation, UI, Forms            ║
    ╚══════════════════════════════════════════════════════════╝
    """)
    
    # Check if dev server is running
    print("⚠️  Make sure your dev server is running!")
    print("   Command: npm run dev")
    print("   Expected: http://localhost:5173")
    
    input("\n📍 Press ENTER when ready to start tests...")
    
    tests_passed = 0
    tests_failed = 0
    
    # Run authentication tests
    if run_command("python test_auth.py", "Authentication Tests"):
        tests_passed += 1
    else:
        tests_failed += 1
    
    time.sleep(2)
    
    # Run navigation tests  
    if run_command("python test_navigation.py", "Navigation & UI Tests"):
        tests_passed += 1
    else:
        tests_failed += 1
    
    # Final summary
    print("\n" + "=" * 60)
    print("📊 FINAL TEST SUMMARY")
    print("=" * 60)
    print(f"   Test Suites Passed: {tests_passed}")
    print(f"   Test Suites Failed: {tests_failed}")
    
    if tests_failed == 0:
        print("\n🎉 ALL TESTS PASSED! Application is working correctly.")
    else:
        print("\n⚠️  Some tests failed. Check output above for details.")
    
    print("=" * 60)
    
    return 0 if tests_failed == 0 else 1

if __name__ == "__main__":
    sys.exit(main())

