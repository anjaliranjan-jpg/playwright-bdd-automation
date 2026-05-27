@api @regression
Feature: API Integration Suite - AutomationExercise API

  # ─── API-001: GET Products List ──────────────────────────────────────────────
  @api-001 @smoke
  Scenario: API-001 Execute GET productsList and validate structural array types
    Given the API client is initialized
    When I send a GET request to the products list endpoint
    Then the response code is 200
    And the response contains an array of products
    And each product has required fields: id, name, price, brand

  # ─── API-002: Invalid POST Products List ─────────────────────────────────────
  @api-002
  Scenario: API-002 Execute invalid POST productsList and assert method rejection
    Given the API client is initialized
    When I send an invalid POST request to the products list endpoint
    Then the response code indicates method not allowed
    And the response message mentions request method not supported

  # ─── API-003: GET Brands List ────────────────────────────────────────────────
  @api-003
  Scenario: API-003 Execute GET brandsList and assert brand items populate the body
    Given the API client is initialized
    When I send a GET request to the brands list endpoint
    Then the response code is 200
    And the response contains a list of brands
    And each brand has required fields: id, brand

  # ─── API-004: Invalid PUT Brands List ────────────────────────────────────────
  @api-004
  Scenario: API-004 Execute invalid PUT brandsList and validate error formatting
    Given the API client is initialized
    When I send an invalid PUT request to the brands list endpoint
    Then the response code indicates method not allowed
    And the response message mentions request method not supported

  # ─── API-005: Search Product with valid param ─────────────────────────────────
  @api-005
  Scenario: API-005 Execute POST searchProduct with valid body parameter
    Given the API client is initialized
    When I search for a product with keyword "top"
    Then the response code is 200
    And the search returns at least one matching product

  # ─── API-006: Search Product missing param ────────────────────────────────────
  @api-006
  Scenario: API-006 Execute POST searchProduct missing required body parameter
    Given the API client is initialized
    When I send a POST searchProduct request without the search parameter
    Then the response code indicates a bad request
    And the response message mentions missing search product parameter

  # ─── API-007: Full User Lifecycle ────────────────────────────────────────────
  @api-007 @smoke
  Scenario: API-007 Execute complete user lifecycle: create, update, get, delete
    Given the API client is initialized
    And I have dynamically generated user data for the lifecycle test
    When I create a new account via POST createAccount
    Then the create account response code is 201
    When I update the account via PUT updateAccount
    Then the update account response code is 200
    When I retrieve the user details via GET getUserDetailByEmail
    Then the get user response code is 200
    And the retrieved user email matches the registered email
    When I delete the account via DELETE deleteAccount
    Then the delete account response code is 200

  # ─── API-008: Verify Login with invalid credentials ──────────────────────────
  @api-008
  Scenario: API-008 Execute POST verifyLogin with invalid credentials
    Given the API client is initialized
    When I verify login with invalid credentials
    Then the response code indicates unauthorized access
    And the response message mentions invalid credentials
