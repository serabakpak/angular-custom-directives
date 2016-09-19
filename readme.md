#### Reflection: 
I really enjoyed this assignment. I didn't really run into many problems. It's actually pretty fun adding 3rd party directives to my app. 

#### Class Original Repo: 
[Angular Custom Directives](https://github.com/sf-wdi-31/angular-custom-directives "Angular Custom Directives") 


<!--
Creator: Team, editing by Cory
Market: SF
-->

![](https://ga-dash.s3.amazonaws.com/production/assets/logo-9f88ae6c9c3871690e33280fcf557f33.png)

# Writing Custom Directives


### Why is this important?
<!-- framing the "why" in big-picture/real world examples -->
*This workshop is important because:*

In Angular, custom directives are the way to write reusable components. "Components" are a modern pattern for creating modular web applications. If we can build a bunch of working components, we can tie them all together to build a full web app. In fact, in Angular 2, one specific category of reusable directive is called a "component." Building a solid directive is the type of contribution you could make to the open source community!

### What are the objectives?
<!-- specific/measurable goal for students to achieve -->
*After this workshop, developers will be able to:*


- Explain the justifications for using custom directives
- Describe the directive definition object and implement it in creating a directive.
- Integrate a third party directive into your code.

### Where should we be now?
<!-- call out the skills that are prerequisites -->
*Before this workshop, developers should already be able to:*

- identify and use Angular's built-in directives.
- build out a working AngularJS front end.

## Custom Directives - Intro

As you've seen by now, directives make up a huge amount of the code you work with in Angular. Angular was designed to be an extension of HTML - a way to have custom-defined interactive tags of your own making.

While we've been leveling up at using the directives that come with Angular, it's time to see what we can do if we start making some of our own.

Building a custom directive can eliminate repetitive code that renders data over and over again. If you're using the same component all over your client side interface, you still want your code to remain DRY (Don't Repeat Yourself). Instead of writing that component in several different views, you can extract it to a custom directive! We can just reference that directive whenever we need to use it and not worry about repeating the code to render it.

Examples:
* A "card" with info on it (see more below)
* Loading indicator or [progress bar](https://angular-ui.github.io/bootstrap/#/progressbar)
* [Stars rating mechanism](https://angular-ui.github.io/bootstrap/#/rating)
* [Date picker](https://angular-ui.github.io/bootstrap/#/datepicker)
* [Color picker](http://ruhley.github.io/angular-color-picker/)


#### Real World Example

As an example, we're going to mess around with duplicating something that's become a common pattern in interface design – the concept of a card. Applications like Twitter, Pinterest, Facebook, and others have moved towards this design pattern.

<img width="571" alt="Twitter" src="https://cloud.githubusercontent.com/assets/25366/9665317/4f8a5e56-5224-11e5-9b9c-fe62d8a6cdf4.png">

Everyone's favorite CSS framework, Bootstrap, is even on board, where in [version 4+ you're able to create a card](http://v4-alpha.getbootstrap.com/components/card/) with just some CSS classes:

<img width="346" alt="Bootstrap" src="https://cloud.githubusercontent.com/assets/25366/9665376/c2bcac6c-5224-11e5-8e4c-807a19a4432a.png">

Let's see if we can make something similar, wrapped up in our own custom HTML element. We want to take something like this:

```html
<div class='card'>
  <h4 class="card-title">{{card.question}}</h4>
  <h6>Cards Against Assembly</h6>
</div>
```

and end up with a reusable `<wdi-card></wdi-card>` component, maybe something like:

```html
<wdi-card question="{{card.question}}"></wdi-card>
```

We want it to look like:

<img width="965" alt="Cards Against Assembly" src="https://cloud.githubusercontent.com/assets/25366/9666972/05a2f348-522e-11e5-8f6c-7c503032eff4.png">


## Know The Code - Independent

[GET THE STARTER CODE HERE!](https://github.com/sf-wdi-31/angular-custom-directives)

Take five minutes and inspect our starter code. You'll see a pretty normal Angular app, and since we're repeating using those cards, and there's a few consistent tags we're repeating every time we render a card, we're going to experiment with making those cards a custom-defined directive.



### Let's be organized!

Rather than just throw this wherever, let's make a file dedicated just to that function. Clean code, yo.

I called it:
```
cardDirective.js
```

#### Directives are as easy as...

Just like controllers and routing configurations, the first line is a simple extension of `angular`:

```js
angular.module('CardsAgainstAssembly')
  .directive('wdiCard', wdiCard);
```

An important thing to point out: The first argument is the name of the directive and how you'll use it in your HTML. **Angular converts `camelCase` to `snake-case` for us, so if you want to use `<secret-garden></secret-garden>` in your HTML, name your directive** `.directive('secretGarden', myFunctionIHaventMadeYet)`.  

Remember, in the official Angular docs it's called `ngClass` or `ngRepeat`, but in your HTML you use `ng-class` and `ng-repeat`.

#### Let's make a function!

```js
angular.module('CardsAgainstAssembly')
  .directive('wdiCard', wdiCard);
```

Because we defined the directive without defining the second argument, we obviously need a function named `wdiCard`!

```js
function wdiCard(){
  var directive = {};
  return directive;
}
```

Nothing fancy yet - we're just constructing an object and then returning it. When making a directive, you use a **Directive Definition Object** to specify the capabilities of your directive. The **Directive Definition Object** has specific keys that it expects in order to define attributes and behavior of your directive.

## Directive Options

You've got a couple interesting options when making your own directives. We'll go through them all, quickly, and you can play with them on your own in a bit.

1. `restrict`
2. `template/templateUrl`
3. `replace`
4. `scope`

#### 1. `restrict`

While the name isn't obvious, the `restrict` option lets us decide what _kind_ of directive we want to make. It looks like this:

```js
restrict: 'EACM',
```

- `E` is element. An HTML element, like `<wdi-card></wdi-card>`
- `A` is attribute. Like `<div wdi-card="something"></div>`
- `C` is class. Like `<div class="wdi-card"></div>`
- `M` is comment. Like `<!-- directive: wdi-card -->`

You can choose to have just one, all of the above, or any combination you like. You should steer towards elements & attributes as much as possible, though – classes can get messy with other CSS classes, and comments could just end up weird if there isn't a good reason for it.

For ours, let's play with just an element.

```js
function wdiCard(){
  var directive = {
    restrict: 'E'
  };
  return directive;
}
```

#### 2. `template/templateUrl`

This is where our partial view comes in. Now, if it's a pretty tiny, self-contained directive, you can use `template: <p> "Some javascript " + string + " concatenation"</p>`

But that easily starts getting ugly, so it's often better (even for small directives like this) to make a quick little partial HTML file and reference it with `templateUrl` instead.

Let's extract our existing card tags, and throw them in a partial. Cut out:

```html
<div class='card'>
  <h4 class="card-title">{{card.question}}</h4>
  <h6>Cards Against Assembly</h6>
</div>
```

Quickly `touch templates/cardDirective.html` or some similarly obvious-named template, and paste it back in.

```html
<!-- templates/cardDirective.html -->
<div class='card'>
  <h4 class="card-title">{{card.question}}</h4>
  <h6>Cards Against Assembly</h6>
</div>
```

In `scripts/cardDirective.js`, we can add our option:

```js
function wdiCard(){
  var directive = {
    //'A' == attribute, 'E' == element, 'C' == class
    restrict: 'E',
    templateUrl:  'templates/cardDirective.html'
  };

  return directive;
}
```

#### 3. `replace`

Replace is pretty straightforward. Should this directive replace the HTML that calls the directive? Do you want it to get rid of what's in the template & swap it out with the template we're going to make? Or add to it, and not remove the original. For example, replacing would mean:

```html
<div ng-repeat="card in cardsCtlr.questionList" >
  <wdi-card></wdi-card>
</div>
```

Would actually render as:

```html
<div ng-repeat="card in cardsCtlr.questionList" >
  <div class='card'>
    <h4 class="card-title">{{question}}</h4>
    <h6>Cards Against Assembly</h6>
  </div>
</div>
```


See, `<wdi-card></wdi-card>` is gone, it's been replaced with the longer-form template that we defined above. Without replace, it would render as:

```html
<div ng-repeat="card in cardsCtlr.questionList" >
  <wdi-card>
    <div class='card'>
      <h4 class="card-title">{{question}}</h4>
      <h6>Cards Against Assembly</h6>
    </div>
  </wdi-card>
</div>
```


Let's say we like the replace option for our example. We simply add `replace: true` to our directive definition object:

```js
function wdiCard(){
  var directive = {
    restrict: 'E',
    replace: true,
    templateUrl:  'templates/cardDirective.html'
  };
  return directive;
}
```

### Get it connected

And lastly, in our `index.html`, let's finally use our custom directive. So exciting. This is it. Here we go.

```html
<!-- index.html -->
<div class='col-sm-6 col-md-6 col-lg-4' ng-repeat="card in cardsCtlr.questionList" >
  <wdi-card></wdi-card>
</div>
```

TRY IT! So awesome! We've now got this much more readable `index.html`, with a _very_ semantic HTML tag describing exactly what we want rendered.

<img width="965" alt="Cards Against Assembly" src="https://cloud.githubusercontent.com/assets/25366/9666972/05a2f348-522e-11e5-8f6c-7c503032eff4.png">

This is awesome. This is a great, reusable component. Except for _one_ thing.

#### 4. `scope`

If you notice, our template uses ``{{card.question}}`` inside it. This obviously works perfectly - we're geniuses. But what if we wanted to render a card somewhere outside of that `ng-repeat`, where `card in cardsCtlr.questionList` isn't a thing. What if we want to render a one-off card, reusing our awesome new directive elsewhere? Isn't that part of the point?

It sure is. We're lacking a precise scope.

Just like controllers, we want to define what our scope is. We want to be able to say "Render a card, with these details, in whatever context I need to render it in." A card shouldn't rely on a controller's data to know what information to render inside it. The controller should pass that data to our directive, so it's freestanding and not relying on anyone but itself.

That's where `directive.scope` comes in, and this lets us decide what attributes our element should have! For example, in our card example, maybe we want to render a card with just a string somewhere outside of this controller. We want to make our own card with our own hardcoded text.

Try this. In your `index.html`, adjust our `<wdi-card>` element to say:

```html
<wdi-card question="{{card.question}}"></wdi-card>
```

In context, you'll see that the `ng-repeat` is giving us the variable `card`, and we're actually just rendering that out as a string. But we've decided we want to have an attribute called `question` to pass data through. We made that up, it's appropriate to our example, but it can be anything.

There are only two other pieces we need to make this reality.

In our `cardDirective.html` partial, let's adjust to:

```html
<div class='card'>
  <h4 class="card-title">{{question}}</h4>
  <h6>Cards Against Assembly</h6>
</div>
```

No longer reliant on a variable named `card`, it's now just reliant on an element having the attribute of `question`.

And finally, in `scripts/cardDirective.js`:

```js
angular.module('CardsAgainstAssembly')
  .directive('wdiCard', wdiCard);

function wdiCard(){
  var directive = {
    //'A' == attribute, 'E' == element, 'C' == class
    restrict: 'E';
    replace: true;
    templateUrl:  "templates/cardDirective.html";
    scope: {
        question: '@'
    };
  };

  return directive;
}
```

In `scope`, we just define an object. The key is whatever want the attribute on the element to be named. So if we want `<wdi-card bagel=""></wdi-card>`, then we'd need a key named `bagel` in our scope object.

#### The Different Types of Scope for a Directive
The _value_ is one of 3 options.

```js
scope: {
  desiredObject: '=',     // Bind the ngModel to the object given
  desiredFunc: '&',      // Pass a reference to a method
  desiredString: '@'     // Store the string associated by fromName
}
```

The corresponding options would look like:

```html
<div scope-example desired-object="to" desired-func="sendMail(email)" desired-string="How is your day today?" />
```

The `=` is a mechanism for binding data that might change; the `&` is for passing a reference to a function you might want to call; and the `@` is simply storing a string & passing it through to the template.

#### Since we've decided to use `@`/strings, let's try it!

Our last test is to see if we can make a card using just a hardcoded string. Then we'll know our card is really reusable.

Somewhere _outside_ the context of the controller, let's say just above the footer in our `index.html`, throw a handmade card in:

```html
<!-- ... -->
</section>
<hr/>
<wdi-card question="Why is Angular so awesome?"></wdi-card>
<footer>
<!-- ... -->
```

<img width="965" alt="Custom Card" src="https://cloud.githubusercontent.com/assets/25366/9668827/a352dbf8-5238-11e5-8d00-80ccf02ca95c.png">

Would you look at that? Our own custom directive - a reusable, semantic HTML component that we designed ourselves.

### A deeper dive on the directive definition object

Check out this[directive definition object cheat sheet from egghead.io.](https://d2eip9sf3oo6c2.cloudfront.net/pdf/egghead-io-directive-definition-object-cheat-sheet.pdf). Specifically look at the `controller` and `link` options that can add functionality to a directive.

We can use directives as simple templating as we did above with the card directive, but we can also make directives that have their own behaviors!

Our code can be separated into small, organized pieces that have a single representation in the code as a directive.

### Integrate a third party directive

UI Bootstrap provides a wide array of useful directives that can bring cool functionality to your applications! Let's integrate the [ui bootstrap rating widget](https://angular-ui.github.io/bootstrap/#/rating) into our Cards Against Assembly app.

#### Resolving dependencies

UI Bootstrap has a handful of dependencies that we need to integrate before this directive will work.

Use bower to install `bootstrap`, `angular-animate`, `angular-sanitize`, and of course, UI bootstrap itself, which is called `angular-bootstrap` when you download it.

In your index.html, include all of these dependencies:

```html
<script src="bower_components/angular/angular.min.js"></script>
<script src="bower_components/angular-animate/angular-animate.min.js"></script>
<script src="bower_components/angular-sanitize/angular-sanitize.min.js"></script>
<script src="bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js"></script>

<script src="scripts/app.js"></script>
<script src="scripts/controllers/cardsController.js"></script>

<link href="bower_components/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet">
```
Include these dependencies in app.js as well

```javascript
angular.module('CardsAgainstAssembly', ['ngAnimate', 'ngSanitize','ui.bootstrap']);

```

#### Building a controller

Using the [rating widget demo's js file](https://angular-ui.github.io/bootstrap/#/rating) as your starting point, build a `rateController` with the necessary attributes. Remember that the example uses `$scope` and we'll use the `vm` syntax:

```javascript

angular.module('CardsAgainstAssembly')
  .controller('rateController', rateController);

function rateController(){
  var vm = this;
  vm.rate = 7;
  vm.max = 10;

  // etc... keep filling in the controller so that it has all of the
  // attributes that the demo has
}
```

Make sure to list `rateController` as a `<script>` in `index.html`!

#### Including the HTML

In a section below the cards, use the rating directive to add a feedback mechanism for users. Note again, the demo provides a good start, but we need to adjust the syntax for our case, adding `rateCtrl` where appropriate:
```html
<section ng-controller="rateController as rateCtrl">
  <h2>Rate our app!</h2>
  <span uib-rating ng-model="rateCtrl.rate" max="rateCtrl.max" read-only="rateCtrl.isReadonly" on-hover="rateCtrl.hoveringOver(value)" on-leave="rateCtrl.overStar = null" titles="['one','two','three']" aria-labelledby="default-rating"></span>
</section>
```

Use the demo as inspiration to add additional features as desired!

### Resources

[Directive definition object cheat sheet from egghead.io](https://d2eip9sf3oo6c2.cloudfront.net/pdf/egghead-io-directive-definition-object-cheat-sheet.pdf) - a great resource for learning more about the specs allowed in the directive definition object.
