@ui @regression
Feature: UI Automation Suite - AutomationExercise Portal

  # ─── UI-001: Home Page Elements ─────────────────────────────────────────────
  @ui-001
  Scenario: UI-001 Verify home page elements and responsive layout sections
    Given I navigate to the home page
    Then the home page logo is visible
    And the navigation bar is visible
    And the featured items section is visible
    And the footer section is visible

  # ─── UI-002: Navigation Accessibility ───────────────────────────────────────
  @ui-002
  Scenario: UI-002 Validate main global header navigation accessibility
    Given I navigate to the home page
    Then all main navigation links are visible
    And the navigation links are accessible

  # ─── UI-003: Login Page Layout ───────────────────────────────────────────────
  @ui-003
  Scenario: UI-003 Navigate cleanly to the Sign-up Login functional layout
    Given I navigate to the home page
    When I click on the Signup Login link
    Then the login form is visible
    And the signup form is visible

  # ─── UI-004: User Registration ───────────────────────────────────────────────
  @ui-004
  Scenario: UI-004 Register an entirely new user using dynamic data generation
    Given I navigate to the home page
    When I click on the Signup Login link
    And I fill the signup form with dynamically generated user data
    And I complete the registration form
    Then the account is created successfully
    And I continue to the home page as a logged in user

  # ─── UI-005: Login with valid credentials ────────────────────────────────────
  @ui-005 @smoke
  Scenario: UI-005 Log in with valid credentials and verify user profile banner
    Given a registered user exists in the system
    And I navigate to the home page
    When I click on the Signup Login link
    And I log in with valid credentials
    Then I am logged in and the user profile banner is displayed

  # ─── UI-006: Invalid Login ───────────────────────────────────────────────────
  @ui-006
  Scenario: UI-006 Validate login rejection for invalid credentials
    Given I navigate to the home page
    When I click on the Signup Login link
    And I log in with invalid credentials
    Then a login error message is displayed

  # ─── UI-007: Logout ──────────────────────────────────────────────────────────
  @ui-007
  Scenario: UI-007 Execute a secure session logout and check state redirection
    Given a registered user exists in the system
    And I navigate to the home page
    When I click on the Signup Login link
    And I log in with valid credentials
    And I click the logout button
    Then I am redirected to the login page

  # ─── UI-008: Products Grid View ──────────────────────────────────────────────
  @ui-008
  Scenario: UI-008 Open products grid view and confirm data item visibility
    Given I navigate to the home page
    When I navigate to the products page
    Then the products grid is visible with items

  # ─── UI-009: Product Detail Page ─────────────────────────────────────────────
  @ui-009
  Scenario: UI-009 Open specific product details and confirm attributes
    Given I navigate to the home page
    When I navigate to the products page
    And I click on the first product to view details
    Then the product name is visible
    And the product price is visible
    And the product availability is displayed
    And the product brand is displayed

  # ─── UI-010: Keyword Search - With Results ───────────────────────────────────
  @ui-010
  Scenario: UI-010 Execute keyword product search yielding successful results
    Given I navigate to the home page
    When I navigate to the products page
    And I search for a product with keyword "top"
    Then search results are displayed with matching products

  # ─── UI-011: Keyword Search - Empty State ────────────────────────────────────
  @ui-011
  Scenario: UI-011 Execute keyword product search yielding empty-state results
    Given I navigate to the home page
    When I navigate to the products page
    And I search for a product with keyword "zzzzxxxxxnonexistentproduct12345"
    Then the searched products section is visible
    And no product results are shown

  # ─── UI-012: Brand Filter ────────────────────────────────────────────────────
  @ui-012
  Scenario: UI-012 Apply brand-specific navigational filters and verify item updates
    Given I navigate to the home page
    When I navigate to the products page
    And I click on the brand filter "Polo"
    Then products filtered by brand "Polo" are displayed

  # ─── UI-013: Add to Cart ─────────────────────────────────────────────────────
  @ui-013
  Scenario: UI-013 Add product items into the cart from the grid layout
    Given I navigate to the home page
    When I navigate to the products page
    And I add the first product to the cart
    And I dismiss the cart modal
    And I navigate to the cart page
    Then the cart contains at least one item

  # ─── UI-014: Cart Quantity Update ───────────────────────────────────────────
  @ui-014
  Scenario: UI-014 Add product to cart and verify quantity in cart
    Given I navigate to the home page
    When I navigate to the products page
    And I add the first product to the cart
    And I view cart from the modal
    Then the cart item quantity is shown correctly

  # ─── UI-015: Contact Us Form ─────────────────────────────────────────────────
  @ui-015
  Scenario: UI-015 Complete the contact-us validation form with file upload
    Given I navigate to the home page
    When I click on the Contact Us link
    And I fill the contact form with generated data
    And I upload a file to the contact form
    And I submit the contact form
    Then the contact form submission is successful

  # ─── UI-016: Network Interception ────────────────────────────────────────────
  @ui-016 @smoke
  Scenario: UI-016 Intercept and abort heavy static assets and verify page stability
    Given I navigate to the home page with image requests intercepted
    Then the page layout is stable without blocked image assets
    And key navigation elements remain visible

  # ─── UI-017: Multi-Context Session Sharing ───────────────────────────────────
  @ui-017
  Scenario: UI-017 Multi-context UI session sharing via cookie injection
    Given a registered user exists in the system
    When I log in via browser context A
    And I extract the authenticated cookies from context A
    And I create an isolated browser context B with injected cookies
    Then context B should access the authenticated page without logging in
