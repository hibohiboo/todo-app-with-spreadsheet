module Picshare exposing (..)

import Html exposing (..)
import Html.Attributes exposing (class, src)


viewDetailPhoto : String -> String -> Html msg
viewDetailPhoto url caption =
    div [ class "detailed-photo" ]
        [ img [ src url ] []
        , div [ class "photo-info" ]
            [ h2 [ class "caption" ] [ text caption ]
            ]
        ]


baseUrl : String
baseUrl =
    "https://programming-elm.com/"


main : Html msg
main =
    div []
        [ div [ class "header" ]
            [ h1 [] [ text "Picshare" ]
            ]
        , div [ class "content-flow" ]
            [ viewDetailPhoto (baseUrl ++ "1.jpg") "Surfing"
            , viewDetailPhoto (baseUrl ++ "2.jpg") "The Fox"
            , viewDetailPhoto (baseUrl ++ "3.jpg") "Evening"
            ]
        ]
