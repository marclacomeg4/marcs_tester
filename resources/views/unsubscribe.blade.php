<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>{!! $brandName ?? '' !!} Unsubscribe</title>

    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css?family=Nunito:200,600" rel="stylesheet">

    <!-- Styles -->
    <style>
        html, body {
            background-color: #fff;
            color: #636b6f;
            font-family: 'Nunito', sans-serif;
            font-weight: 200;
            height: 100vh;
            margin: 0;
        }

        .full-height {
            height: 100vh;
        }

        .flex-center {
            align-items: center;
            display: flex;
            justify-content: center;
        }

        .position-ref {
            position: relative;
        }

        .content {
            text-align: center;
        }


    </style>
</head>
<body>

<div class="flex-center position-ref full-height">
    <div class="content">
        <img src="{!! asset('/img/brands/' . ($brandName ?? 'Global4') . '.png') !!}" alt="">

        <h2>You have now been unsubscribed</h2>
        <p>
            Thank you for letting us know you our not currently interested in our services. We have added you email to
            our 'Do Not Contact' database so we don't disturb you again.
        </p>
    </div>
</div>
</body>
</html>
