Create a complete, high-quality **desktop web UI/UX design for a New Business Car Insurance purchase journey** for a modern customer insurance portal.

This is a professional **UI/UX design assessment**, so prioritize strong UX thinking, clear information architecture, usability, accessibility, interaction design, responsive thinking, and polished visual design. Do not create a generic insurance landing page. Design a realistic end-to-end product experience that demonstrates senior-level UX/UI design ability.

## 1. PRODUCT OBJECTIVE

Design a simple, trustworthy, transparent and low-friction experience that helps a customer explore and purchase a new car insurance policy.

The customer should be able to:

1. Start a new car insurance journey
2. Enter their vehicle registration number
3. Retrieve and review vehicle details
4. Confirm vehicle information
5. Provide additional information needed for a quote
6. View and compare insurance plans
7. Select relevant optional add-ons
8. Review the complete quote
9. Proceed through payment
10. Receive confirmation and policy details

The experience should reduce uncertainty and make insurance terminology easy to understand.

## 2. PRIMARY USER

Primary user:
A car owner who wants to purchase a new car insurance policy online.

Assume the user may not be an insurance expert.

User needs:

* Quickly identify their vehicle
* Avoid unnecessary manual data entry
* Understand what each insurance plan covers
* Compare plans easily
* Understand optional add-ons
* Clearly understand the final price
* Feel confident before making payment
* Recover easily from errors

## 3. UX PRINCIPLES

Use these principles throughout the experience:

* Progressive disclosure
* Clear visual hierarchy
* Recognition over recall
* Minimal cognitive load
* Plain and understandable language
* Strong feedback after user actions
* Error prevention and recovery
* Consistency
* Accessibility
* Clear primary and secondary actions
* Transparent pricing
* User control
* Easy back/edit navigation
* Do not overwhelm users with too much information at once

Every screen should have ONE clear primary objective.

Avoid unnecessary steps.

Do not force users through a separate comparison screen if comparison can be optional from the plan-selection screen.

## 4. OVERALL INFORMATION ARCHITECTURE

Structure the journey into five meaningful stages:

1. Vehicle
2. Details
3. Cover
4. Review
5. Payment

Use a subtle horizontal progress indicator at the top of the journey:

Vehicle → Details → Cover → Review → Payment

Show the current stage clearly.

Do NOT use an intimidating "Step 1 of 14" pattern.

Allow users to go back and edit previously entered information without losing their progress.

## 5. DESIGN SYSTEM

Create a clean, modern, trustworthy insurance design system.

Style:

* Modern
* Professional
* Premium but approachable
* Clean
* Minimal
* Spacious
* Strong UX hierarchy
* Not overly corporate
* Not visually noisy

Use:

* White/light neutral backgrounds
* One strong primary brand color
* Dark neutral text
* Subtle borders
* Soft elevation where appropriate
* Moderate corner radius
* Clear CTA hierarchy
* Accessible contrast
* Consistent spacing

Typography:
Use **Inter**.

Create a consistent typography scale for:

* Page titles
* Section headings
* Card headings
* Body text
* Supporting text
* Labels
* Prices
* Buttons
* Error messages

Use an 8px spacing system.

Create reusable components with Auto Layout and variants.

Components should include:

* Primary button
* Secondary button
* Text button
* Text input
* Radio button
* Checkbox
* Select/dropdown
* Toggle
* Cards
* Insurance plan cards
* Add-on cards
* Alert
* Error message
* Success message
* Tooltip
* Modal
* Progress indicator
* Header
* Footer
* Price summary
* Accordion
* Payment method selector

## 6. SCREEN 01 — CAR INSURANCE LANDING

Create a clean starting page.

Headline:

"Get the right cover for your car"

Supporting text:

"Compare cover options, choose the protection you need, and get your policy online."

Primary CTA:

"Get a quote"

Supporting reassurance:

"Simple, secure and takes only a few minutes."

Show a subtle relevant car/insurance visual, but keep the page product-focused rather than decorative.

Do not use excessive marketing content.

## 7. SCREEN 02 — VEHICLE REGISTRATION

Heading:

"Let's find your car"

Supporting text:

"Enter your vehicle registration number and we'll retrieve your vehicle details."

Input label:

"Vehicle registration number"

Example:

"TN 38 AB 1234"

Primary CTA:

"Find my vehicle"

Secondary action:

"Back"

Add useful helper text explaining why the registration number is needed.

Use a clear validation state.

Invalid example:

"We couldn't find a vehicle with this registration number."

Supporting guidance:

"Check the registration number and try again."

CTA:

"Try again"

## 8. SCREEN 03 — VEHICLE LOOKUP LOADING STATE

Create a realistic loading state after the user submits the registration number.

Heading:

"Finding your vehicle details..."

Supporting text:

"This should only take a moment."

Use a subtle skeleton/loading animation.

Do not make the loading screen overly decorative.

## 9. SCREEN 04 — VEHICLE DETAILS

Heading:

"We found your vehicle"

Display a clear vehicle summary.

Example:

Hyundai Creta SX(O)

2023 • Petrol • Automatic

Show:

Make & model
Hyundai Creta

Variant
SX(O)

Manufacturing year
2023

Fuel type
Petrol

Registration date
12 March 2023

Primary CTA:

"Yes, these details are correct"

Secondary action:

"Something's wrong?"

Allow editing/recovery without restarting the journey.

Include a subtle trust message:

"Your vehicle details were retrieved using your registration number."

## 10. SCREEN 05 — ADDITIONAL INFORMATION

Heading:

"Tell us a little more about your car"

Use a multi-section form rather than one long overwhelming form.

Section 1:

"How do you use your car?"

Options:

* Personal
* Work
* Personal & work

Section 2:

"Do you currently have car insurance?"

Options:

* Yes
* No

If Yes, reveal:

"Current policy expiry date"

Use progressive disclosure.

Add any other reasonable information required to generate a quote, but do not overcomplicate the form.

Show progress indicator:

Vehicle → Details → Cover → Review → Payment

Primary CTA:

"Continue"

Secondary:

"Back"

## 11. SCREEN 06 — INSURANCE PLANS

This should be the HERO UX screen of the entire experience.

Heading:

"Choose the cover that's right for you"

Supporting text:

"Compare what's included and choose the protection that fits your needs."

Show three insurance plans:

PLAN 1:
"Essential"

Example premium:
"₹12,450/year"

Description:
"Essential protection for everyday driving."

PLAN 2:
"Recommended"

Example premium:
"₹16,850/year"

Add a visually prominent "Recommended" badge.

Description:
"Balanced protection with broader cover."

PLAN 3:
"Premium"

Example premium:
"₹21,950/year"

Description:
"Maximum protection for greater peace of mind."

Each plan should clearly display:

* Plan name
* Price
* Short description
* Coverage highlights
* Key benefits
* Deductible/excess where applicable
* CTA

Use checkmarks for included coverage.

Example coverage:
✓ Accident damage
✓ Theft protection
✓ Third-party liability
✓ Natural disaster protection

Do not use real-world insurance company branding.

Make pricing easy to scan.

Include:

"Compare plans"

as an optional action.

## 12. SCREEN 07 — COMPARE PLANS

Create a dedicated comparison experience that can be opened from the plan screen.

Heading:

"Compare your cover"

Create a clear comparison table.

Rows may include:

* Accident damage
* Theft
* Third-party liability
* Natural disasters
* Personal accident cover
* Roadside assistance
* Deductible
* Annual premium

Use simple ✓ / — indicators.

Avoid tiny text.

Highlight the recommended plan subtly.

Allow the user to select one plan.

CTA:

"Select plan"

## 13. SCREEN 08 — ADD-ONS

Heading:

"Add extra protection"

Supporting text:

"Choose optional protection based on what matters to you."

Create clear add-on cards.

Example:

"Zero Depreciation"

Description:

"Reduce depreciation deductions on eligible parts when making a claim."

Additional premium:

"+ ₹1,200/year"

CTA:

"Add"

When selected:

"Added ✓"

Other add-ons:

"Roadside Assistance"
"+ ₹750/year"

"Engine Protection"
"+ ₹1,500/year"

"Key Replacement"
"+ ₹450/year"

Do not automatically select unnecessary add-ons.

Provide a "Why might I need this?" interaction using tooltip or expandable information.

Include:

"Skip for now"

as a secondary action.

## 14. SCREEN 09 — QUOTE REVIEW

Heading:

"Review your quote"

Supporting text:

"Check your cover and premium before continuing."

Create a highly readable summary.

Vehicle:

Hyundai Creta SX(O)
2023 • Petrol

Selected plan:

Recommended

Coverage summary:
Show key cover items.

Selected add-ons:
Zero Depreciation
Roadside Assistance

Premium breakdown:

Base premium
₹16,850

Add-ons
₹1,950

Taxes & fees
₹650

Divider

TOTAL PAYABLE
₹19,450/year

Make the final payable amount visually prominent.

Provide edit actions:

"Change plan"

"Edit add-ons"

"Edit vehicle details"

Primary CTA:

"Proceed to payment"

Include a small confirmation/reassurance message:

"You'll receive your policy documents after successful payment."

## 15. SCREEN 10 — PAYMENT

Heading:

"Complete your payment"

Show:

Amount payable:
₹19,450

Payment methods:

UPI
Credit / Debit Card
Net Banking

Use a clean payment method selector.

Primary CTA:

"Pay ₹19,450"

Include security reassurance:

"Your payment is secure."

Do not make the payment page visually complicated.

## 16. SCREEN 11 — PAYMENT FAILURE

Create an important error state.

Heading:

"Payment wasn't completed"

Supporting text:

"Your payment could not be processed. Your insurance policy has not been purchased."

Actions:

"Try payment again"

"Choose another payment method"

Do not blame the user.

Clearly communicate that no policy has been purchased.

Keep their quote and selections intact.

## 17. SCREEN 12 — SUCCESS / POLICY CONFIRMATION

Create a polished success screen.

Use a clear success icon.

Heading:

"Your car insurance is active"

Supporting text:

"Your policy has been successfully purchased."

Show:

Policy number:
TJ-XXXXXX

Vehicle:
Hyundai Creta SX(O)

Coverage period:
29 Aug 2026 – 28 Aug 2027

Premium paid:
₹19,450

Status:
Active

Primary CTA:

"View policy"

Secondary CTA:

"Download policy"

Additional:

"Go to dashboard"

Include a reassuring confirmation message.

## 18. IMPORTANT EDGE CASES

Design the following states as part of the UX system:

1. Invalid registration number
2. Vehicle not found
3. Vehicle details loading
4. Vehicle details incorrect
5. Required form field validation
6. User attempts to continue without completing required information
7. No insurance plans available
8. Add-on selected/deselected
9. Payment processing
10. Payment failed
11. Payment successful
12. Session interruption / resume journey

The user should never feel stuck.

## 19. RESPONSIVE THINKING

Design primarily for desktop web.

Use a consistent desktop grid.

Recommended:

* 1440px desktop frame
* 12-column grid
* Max content width around 1200px
* Generous whitespace
* Comfortable reading width

Also demonstrate that the layout can adapt to smaller desktop/tablet widths.

Do not create separate mobile screens unless necessary.

## 20. ACCESSIBILITY

Ensure:

* WCAG-conscious contrast
* Clearly visible focus states
* Buttons have clear labels
* Form fields have visible labels
* Error messages are understandable
* Do not rely only on color to communicate status
* Minimum comfortable touch/click targets
* Text remains readable
* Icons support text rather than replacing important information

## 21. MICROCOPY

Use concise, human and reassuring language.

Avoid complicated insurance jargon.

Instead of:
"Proceed with the aforementioned insurance coverage selection"

Use:
"Choose your cover"

Instead of:
"Invalid credentials"

Use:
"Check your registration number and try again."

## 22. FIGMA ORGANIZATION

Create clearly named Figma pages:

01 — Brief & Assumptions
02 — User Flow
03 — Wireframes
04 — Design System
05 — High Fidelity UI
06 — States & Edge Cases
07 — Prototype

Create clearly named frames.

Create reusable components and variants.

Use Auto Layout consistently.

Use components instead of manually duplicated UI.

## 23. ASSUMPTIONS PAGE

Create a small assumptions section in the Figma file.

Document assumptions such as:

* The customer is purchasing a new car insurance policy online.
* Vehicle details are retrieved using the registration number.
* The retrieved vehicle information can be reviewed before confirmation.
* Additional information is required to generate an appropriate quote.
* Three example insurance plans are shown for demonstration.
* Premium values are illustrative and not real insurance pricing.
* Optional add-ons can be selected or skipped.
* Payment is completed through an external secure payment gateway.
* Policy documents become available after successful payment.

Clearly label these as assumptions rather than factual insurance rules.

## 24. USER FLOW PAGE

Create a visually clear user flow diagram:

Start
↓
Car Insurance Landing
↓
Registration Number
↓
Vehicle Lookup
↓
Vehicle Details
↓
Confirm Vehicle
↓
Additional Information
↓
Insurance Plans
↓
Compare Plans (optional)
↓
Select Plan
↓
Add-ons
↓
Review Quote
↓
Payment
↓
Payment Success
↓
Policy Confirmation

Show important alternate paths:

Invalid registration → Try again

Incorrect vehicle details → Edit / correct

Payment failure → Retry / change payment method

## 25. PROTOTYPE

Create a clickable prototype connecting the main happy path:

Landing
→ Registration
→ Loading
→ Vehicle Details
→ Additional Information
→ Plans
→ Compare
→ Add-ons
→ Review
→ Payment
→ Success

Also connect:

* Back navigation
* Edit actions
* Invalid registration state
* Payment failure state
* Retry payment

Use subtle transitions.

Do not use excessive animation.

## 26. VISUAL QUALITY BAR

The final design should feel like a real production-ready insurance customer portal.

Avoid:

* Generic templates
* Excessive gradients
* Excessive glassmorphism
* Too many colors
* Huge decorative illustrations
* Overloaded cards
* Tiny text
* Excessive shadows
* Unnecessary animations
* Dribbble-style decoration that hurts usability

Prioritize:

* Strong hierarchy
* Excellent spacing
* Clear content grouping
* Simple interactions
* Trust
* Transparency
* Professional polish

The final result should demonstrate that the designer can solve a real business problem through UX and then translate that thinking into high-quality UI.

## 27. FINAL DESIGN REVIEW

Before completing the design, internally review every screen against:

UX clarity
Information hierarchy
Consistency
Accessibility
Error handling
User control
Content clarity
Visual hierarchy
Spacing
Typography
Component consistency
Interaction states
End-to-end journey

Make corrections automatically where needed.

The final output should look like a **senior UI/UX designer's assessment submission**, not a generic AI-generated website.
