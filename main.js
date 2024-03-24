var app = angular.module('myApp', ['ngRoute'])
app.config(function($routeProvider) {
    $routeProvider
    .when('/home',{
        templateUrl: 'home.html?' + Math.random(),
        controller: 'homeCtrl',
        controllerAs: 'home'
    })
    .when('/register',{
        templateUrl: 'register.html?' + Math.random(),
        controller: 'registerCtrl'
    })
    .when('/search/:id',{
        templateUrl: 'search.html?' + Math.random(),
        controller: 'searchCtrl'
    })
    .when('/cart', {
        templateUrl: 'cart.html?' + Math.random(),
        controller: 'cartCtrl'
    })
    .when('/productdetails/:id', {
        templateUrl: 'productdetails.html?' + Math.random(),
        controller: 'productdetailsCtrl'
    })
    .when('/category/', {
        templateUrl: 'category.html?' + Math.random(),
        controller: 'categoryCtrl'
    })
    .when('/category/:id', {
        templateUrl: 'category.html?' + Math.random(),
        controller: 'categoryCtrl'
    })
    .otherwise({
        redirectTo: '/home'
    })
})

app.controller('mainCtrl', function ($scope, $rootScope, $http) {
    $rootScope.products = []

    $scope.page = 1
    $scope.limit = 20
    $scope.totalPage = 0
    
    $http.get('products.json').then(function (response) {
        $rootScope.products = response.data
        $scope.totalPage = Math.ceil($rootScope.products.length / $scope.limit)
        $scope.numberOfPage = Array.from(Array($scope.totalPage).keys())
    })

    $scope.changePage = function (page) {
        $scope.page = page
        $scope.start = (page - 1) * $scope.limit < 0 ? 0 : (page - 1) * $scope.limit
        var btns = document.querySelectorAll('.page-link')
        for (const value of btns) {
            value.classList.remove('active')
        }
        var pgActive = document.getElementsByName(page)[0]
        pgActive.classList.add('active')
    }

    $rootScope.delFromCart = function (index) {
        $rootScope.cart.splice(index, 1)
        $rootScope.totalPrice = 0
        $rootScope.cart.forEach(product => $rootScope.totalPrice += product.amount * product.product.Price)
    }
})

app.controller('homeCtrl', function ($scope, $rootScope) {
    $scope.products = $rootScope.products
})

app.controller('cartCtrl', function ($scope, $rootScope) {
})

app.controller('headerCtrl', function ($scope, $rootScope) {
    $scope.searchTxt = ''
    $rootScope.cart = []
})

app.controller('searchCtrl', function ($scope, $rootScope, $routeParams) {
    $scope.searchTxt = $routeParams.id.toLowerCase()
    $scope.products = []
    $rootScope.products.forEach((product) => {
        product.Name = product.Name.toLowerCase()
        if (product.Name.includes($scope.searchTxt)) {
            $scope.products.push(product)
        }
    })
    
})

app.controller('productdetailsCtrl', function ($scope, $rootScope, $routeParams) {
    var id = $routeParams.id
    $scope.product = $rootScope.products.find((product) => product.ID === id)
    $scope.products = $rootScope.products.filter((product) => product.BST[0] === $scope.product.BST[0])

    $scope.amount = 1
    $scope.addToCart = function () {
        $rootScope.totalPrice = 0
        var prod = {
            product: $scope.product,
            amount: $scope.amount
        }
        var flag = true
        $rootScope.cart.find(product => {
            if (product.product.Name === prod.product.Name) {
                product.amount += prod.amount
                flag = false
            }
        })
        if(flag) {
            $rootScope.cart.push(prod)
        }
        $rootScope.cart.forEach(product => $rootScope.totalPrice += product.amount * product.product.Price)
    }
})

app.controller('categoryCtrl', function ($scope, $rootScope, $routeParams, $http) {
    var id = $routeParams.id === undefined ? '' : $routeParams.id
    console.log(id)
    $scope.products = $rootScope.products

    if (id !== '') {
        $scope.products = $scope.products.filter((sp) => sp.Type === id)
    }

    $scope.type = id === 'betrai' ? 'Bé trai' : id === 'begai' ? 'Bé gái' : 'Tất cả'
})

app.filter('BST', function () {
    return function (input, value) {
        var output = []
        for (const key of input) {
            key.BST.filter(element => element === value ? output.push(key) : '')
        }
        return output
    }
})