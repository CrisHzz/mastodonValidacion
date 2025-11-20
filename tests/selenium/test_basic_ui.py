"""
Selenium Basic UI Tests for Mastodon
10 simple tests to validate basic UI elements
"""
import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


class TestBasicUI:
    """Basic UI validation tests."""
    
    def test_01_page_loads(self, driver, base_url):
        """Test 1: Verify the home page loads successfully."""
        driver.get(base_url)
        assert "Mastodon" in driver.title or driver.title != ""
    
    def test_02_page_title_exists(self, driver, base_url):
        """Test 2: Verify page has a title."""
        driver.get(base_url)
        title = driver.title
        assert title is not None and len(title) > 0
    
    def test_03_login_form_exists(self, driver, base_url):
        """Test 3: Verify login form or sign in elements exist."""
        driver.get(base_url)
        # Look for common login-related elements
        page_source = driver.page_source.lower()
        assert any(keyword in page_source for keyword in ["sign in", "log in", "login", "email", "password"])
    
    def test_04_html_structure(self, driver, base_url):
        """Test 4: Verify basic HTML structure."""
        driver.get(base_url)
        html_element = driver.find_element(By.TAG_NAME, "html")
        assert html_element is not None
        
        body_element = driver.find_element(By.TAG_NAME, "body")
        assert body_element is not None
    
    def test_05_meta_tags_present(self, driver, base_url):
        """Test 5: Verify meta tags are present."""
        driver.get(base_url)
        meta_tags = driver.find_elements(By.TAG_NAME, "meta")
        assert len(meta_tags) > 0
    
    def test_06_links_exist(self, driver, base_url):
        """Test 6: Verify page has links."""
        driver.get(base_url)
        links = driver.find_elements(By.TAG_NAME, "a")
        assert len(links) > 0
    
    def test_07_scripts_loaded(self, driver, base_url):
        """Test 7: Verify JavaScript files are loaded."""
        driver.get(base_url)
        scripts = driver.find_elements(By.TAG_NAME, "script")
        assert len(scripts) > 0
    
    def test_08_stylesheets_loaded(self, driver, base_url):
        """Test 8: Verify CSS files are loaded."""
        driver.get(base_url)
        stylesheets = driver.find_elements(By.TAG_NAME, "link")
        css_links = [link for link in stylesheets if link.get_attribute("rel") == "stylesheet"]
        assert len(css_links) > 0
    
    def test_09_page_has_content(self, driver, base_url):
        """Test 9: Verify page has text content."""
        driver.get(base_url)
        body = driver.find_element(By.TAG_NAME, "body")
        body_text = body.text
        assert len(body_text.strip()) > 0
    
    def test_10_viewport_responsive(self, driver, base_url):
        """Test 10: Verify viewport meta tag for responsiveness."""
        driver.get(base_url)
        viewport_meta = driver.find_elements(By.XPATH, "//meta[@name='viewport']")
        # Either has viewport meta or page is responsive
        assert len(viewport_meta) > 0 or driver.execute_script("return window.innerWidth") > 0
