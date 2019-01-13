# PIZZAConstructor

PIZZAConstructor is a website who allow for register users to construct own pizza and create group orders with friends and colleagues, user can customize pizza recipe in multiple way choosing from multiple variants of dough,sauce and ingredients, also can select other items from menu as a suggested food for current recipe. User can send orders with newly created pizza or other items from site menu and can track current order from user orders tab.

## Contents

### 1.[Goals and Features](#goals-and-features)

### 2.[Tools and Technologies](#tools-and-technologies)

### 2.1.[Prototyping Tools](#prototyping-tools)

### 2.2.[Development Technologies](#development-technologies)

### 2.3.[Development Tools](#development-tools)

### 3.[Functionality](#functionality)

### 3.1.[Actors](#actors)

### 3.2.[Functional Description](#functional-description)

### 4.[User Interface](#user-interface)

### 4.1.[Fonts and Colors](#fonts-and-colors)

### 4.2.[Design Message](#design-message)

### 4.3.[Logo](#logo)

### 4.4.[Navigation and Organization](#navigation-and-organization)

### 4.5.[Prototype](#prototype)

### 5.[Development](#development)

### 5.1.[BD Architecture](#bd-architecture)

### 5.2.[Application Architecture](#application-architecture)

## Goals and Features

#### Goals

Main goals of this project are:

- Gain new skills in web application development using new technologies
- Create original design
- Offers new features for pizzas/food delivery web site

#### Features

This website has multiple features who increase convenince level of users, but most impotant and originals from all are:

- Ability to construct own pizza from scratch or based on another pizza recipe
- Group order creation and sharing with a non registered users

## Tools and Technologies
### Prototyping Tools

Used application :

- [Adobe XD](https://www.adobe.com/uk/products/xd.html)
- [Adobe Ilustrator](https://www.adobe.com/products/illustrator.html)
- [Adobe Photoshop](https://www.adobe.com/products/photoshop.html)

Adobe XD Plugins:

- PhotoSplash
- UI Faces
- Lorem Ipsum

Adobe XD UI kits:

- [Bootstrap ui](https://xdresources.co/resources/bootstrap-4-ui)
- Web XD wireframe kit
- Material Design kit

Icons sets (glyphicon, font awesome):

- [Iconify](https://iconify.design/)
  - [Font Awesome 4](https://iconify.design/icon-sets/fa/)
- [Flaticon](https://www.flaticon.com/)
  - [Gastronomy Set](https://www.flaticon.com/packs/gastronomy-set)
  - [Allergenic Food](https://www.flaticon.com/packs/allergenic-food)

Fonts:

- [Google Fonts](https://fonts.google.com/)
### Development Technologies
- Runtime: NodeJS
- Framework: Express
- Database: MongoDB

Languages and Preprocessors:
- Html 5
- jQuery
- SASS(CSS)
### Development Tools
#### Tools

- VisualStudioCode
- Google Chrome

##### Plugins

- Gulp
- EsLint
- Nodemon
- Mongoose
- bcrypt-nodejs
- bootstrap
- connect-mongo
- dotenv
- express-session
- faker
- mkdirp
- moment
- mongoose-autopopulate
- mongoose-url-slugs

For all list see <b>package.json</b> file

## Functionality

In this section is described what application can do an all possible interactions with application from all actors points of view based on its capabilities.

### Actors

Posible actors in interaction with web site:

- Unregistered user
- Registered user
- Group order user(user who enter on site using group order link)

### Capabilities

Unregistered user can:

- View following pages:
  - Home
  - Promotions
  - All Menu dropdown pages
  - All Items pages
    Registered user can:
- View following pages:
  - Home
  - Promotions
  - All Menu dropdown pages
  - All Items pages
  - Pizza page witch customize button
  - Pizza creation page
  - Group order
  - Group order creation page
  - All user dropdown page
  - Basket
- Modify following page:

  - Basket
  - Group order
  - My Profile
  - Pizza creation

Group order user can:

- View following pages:
  - Home
  - Promotions
  - All Menu dropdown pages
  - All Items pages
  - Group order
  - Basket
- Modify following page:
  - Basket

### Functional Description

#### Authorization

##### Register

- [ ] Registered

1. Any accesible page
2. Click on Sign In button
3. Click on Register button
4. Enter personal data
5. Wait for succes response

##### Login

- [x] Registered

1. Any accesible page
2. Click on Sign In button
3. Enter username and password
4. Wait for succes response

##### LogOut

- [x] Registered
- [x] Logged

1. Any accesible page
2. Click on user dropdown menu from sidebar
3. Click on Logout button

#### Basket Interactions as a registered user

##### Add item to Basket

- [x] Registered
- [x] Logged

1. Any page with product items
2. Click on 'Add to basket' button

##### Delete item from Basket

- [x] Registered
- [x] Logged
- [x] Having items in Basket

1. Any accesible page
2. Click on 'Basket' image/button from sidebar
3. Click on 'X'-delete button on selected item

##### Clear Basket

- [x] Registered
- [x] Logged
- [x] Having items in Basket

1. Any accesible page
2. Click on 'Basket' image/button from sidebar
3. Click on 'Clear' button

##### Send Order

- [x] Registered
- [x] Logged
- [x] Having items in Basket

1. Any accesible page
2. Click on 'Basket' image/button from sidebar
3. Click on 'Order' button

#### Group Order as a order admin

##### Create Group Order

- [x] Registered
- [x] Logged

1. Any accesible page
2. Open user dropdown menu from sidebar
3. Click 'Group Order' menu item
4. Add valability time
5. Click 'Save' button

##### Save Group Order

- [x] Registered
- [x] Logged
- [x] Created Group Order

1. Any accesible page
2. Click 'Group User' image/button from sidebar
3. Modify all you wont
4. Click 'Save' button

##### Add User to Group Order

- [x] Registered
- [x] Logged
- [x] Created Group Order

1. Any accesible page
2. Click 'Group User' image/button from sidebar
3. Click 'Add User' button from 'Users Orders'
4. Enter user data
5. Click 'Save' button

##### Delete User from Group Order

- [x] Registered
- [x] Logged
- [x] Created Group Order

1. Any accesible page
2. Click 'Group User' image/button from sidebar
3. Click 'Delete User' button from selected user group
4. Click 'Save' button

##### Add Items for user order(part of group order)

- [x] Registered
- [x] Logged
- [x] Created Group Order

1. Any accesible page
2. Click 'Group User' image/button from sidebar
3. Click 'Add Item' button from selected user group
4. Select Item
5. Click 'Save' button

##### Delete Items for user order(part of group order)

- [x] Registered
- [x] Logged
- [x] Created Group Order

1. Any accesible page
2. Click 'Group User' image/button from sidebar
3. Click 'X' - delete button from selected item
4. Click 'Save' button

#### Basket Interactions as a group order user

##### Add item to Basket

- [x] Registered
- [ ] Registered
- [x] Logged
- [ ] Logged
- [x] used valid Group Order link

1. Any page with product items
2. Click on 'Add to basket' button

##### Delete item from Basket

- [x] Registered
- [ ] Registered
- [x] Logged
- [ ] Logged
- [x] used valid Group Order link

1. Any accesible page
2. Click on 'Basket' image/button from sidebar
3. Click on 'X'-delete button on selected item

##### Clear Basket

- [x] Registered
- [ ] Registered
- [x] Logged
- [ ] Logged
- [x] used valid Group Order link

1. Any accesible page
2. Click on 'Basket' image/button from sidebar
3. Click on 'Clear' button

##### Add order to group order

- [x] Registered
- [ ] Registered
- [x] Logged
- [ ] Logged
- [x] used valid Group Order link

1. Any accesible page
2. Click on 'Basket' image/button from sidebar
3. Click on 'Add to Group Order' button

## User Interface

### Fonts and Colors

#### Fonts: [Quicksand](https://fonts.google.com/specimen/Quicksand)

![Colors](/_source/images/colors.png)

### Design Message

Our brand is based on:

- Logo
- Main application features
- 3 main colors used in design
  - Gray and its shades
  - White
  - Golden

Combination of Gray and white is the base of all application design, golden is used as a button color for succes buttons(Add to basket,Order,Save changes etc),r ed is used as a attention color(color for food allergens).Gray and white combination are soothingly for user and golden is a succes color who push user to act, in our case to order a pizza or other food.

### Logo

Logo ilustrate using text and image one of the main feature of application - Ability to construct own pizza

![Logo](/_source/images/logo.png)

### Navigation and Organization

For fastest and confortable navigation is used a navbar with all important pages shortcuts. Navbar can have multiple states for register user, unregister user, group order user

This site is organized on following pages:

- Home
- Menu
  - Pizza
  - Salad
  - Desert
  - Drinks
  - Vegan
- Promotions
- Pizza creation

Items pages:

- Pizza
- Other Food/Drink

User Dropdown pages:

- User page
  - My Profile
  - My Orders
  - My Recipes
- Group Order

### Prototype

Online Prototype: [PizzaCreator Prototype](https://xd.adobe.com/view/9d21c28e-baea-4c80-7d17-81db8c936b0f-eb10/).

Design Specifications: [PizzaCreator Design Specs](https://xd.adobe.com/spec/9f58ae1c-3a68-40a5-7dd3-76b360c87d34-e969/).
### Development
#### Menu Page Parts
##### Bootstrap parts 
- [Navbar](https://getbootstrap.com/docs/4.0/components/navbar/).
- [Carousel](https://getbootstrap.com/docs/4.0/components/carousel/).
- [Modals](https://getbootstrap.com/docs/4.0/components/modal/)
##### CSS grid parts
- [Footer](https://codepen.io/silverfang94/pen/pqxLEE).
- [Page Content](https://codepen.io/silverfang94/pen/WLYrBy).
    - [Menu](https://codepen.io/silverfang94/pen/LMJMPP).
    - [Products](https://codepen.io/silverfang94/pen/MZqQEy).
        - [Pizza Tile](https://codepen.io/silverfang94/pen/OrrbLg).
    - [Sugested Sidebar](https://codepen.io/silverfang94/pen/GPPNoW).
        - [Sugested Tile](https://codepen.io/silverfang94/pen/Ydjggw).
### BD Architecture
![BD_Schema](/_source/images/pizzaconstructorBD.png)
### Application Architecture
![App_Schema](/_source/images/pizzaconstructorApplication.png)

