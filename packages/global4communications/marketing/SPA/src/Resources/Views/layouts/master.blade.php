<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Global 4 Email SPA</title>

    <meta name="csrf_token" content="{!! csrf_token() !!}"/>
    <meta name="csrf-token" content="{!! csrf_token() !!}"/>
    <meta name="graph-token" content="{!! \Auth::user()->graph_token !!}"/>
    <meta name="temp-auth" content="{!! env('GRAPHQL_TEMP_AUTH') !!}"/>
    <meta name="graph-url" content="{!! env('GRAPHQL_URL') !!}"/>

    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <link href='https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900|Material+Icons' rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/@mdi/font@3.x/css/materialdesignicons.min.css" rel="stylesheet">
</head>
<body>

<div class="container-fluid">
    @yield('content')
</div>

@if(env('APP_ENV') !== 'production')
    <script src="{!! asset(mix('js/app.js')) !!}"></script>
@else
<script src="{{env('APP_URL')}}/js/app.js"></script>
@endif
</body>
</html>





