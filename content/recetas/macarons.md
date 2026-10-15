---
title: Macarons
# icon: fluent-emoji:shortcake
alt: Macarons
inlineAmounts: true
ingredientGroups:
  - id: tapas
    label: Tapas
    items:
      - { id: whites, label: Clara, quantity: 110, unit: g, note: 'aproximadamente {3} claras' }
      - { id: sugar, label: Azúcar, quantity: 50, unit: g }
      - { id: almond-flour, label: Harna de almendras, quantity: 100, unit: g }
      - { id: icing-sugar, label: Azúcar impalpable, quantity: 200, unit: g }
      - { id: cocoa, label: Cacao amargo, quantity: 10, unit: g, note: opcional }
  - id: relleno-de-chocolate
    label: ':🍫: Relleno de chocolate'
    items:
      - { id: coffee, label: Café instantáneo, quantity: 2, unit: cdta }
      - { id: liquor, label: 'Cognac, ron, wisky o vino blanco', quantity: 10, unit: g }
      - { id: dulce-de-leche, label: Dulce de leche repostero, quantity: 200, unit: g }
      - { id: chocolate, label: Chocolate semiamargo, quantity: 50, unit: g }
---


::RecipeIngredients
::

::RecipeProcess{:process="true"}

### Masa

1. Batir :RecipeAmount[las claras]{ingredient="whites"} con :RecipeAmount[el azúcar]{ingredient="sugar"} con la batidora. Por 10 minutos. Debería quedar un merengue bien firme.
2. En otro bowl, con un tamizador, incorporar :RecipeAmount[la harina de almendras]{ingredient="almond-flour"}, :RecipeAmount[el cacao amargo]{ingredient="cocoa"} (opcional) y :RecipeAmount[el azúcar impalpable]{ingredient="icing-sugar"}.
3. Si se va a usar colorante, agregarlo a las claras en los últimos segundos del batido.
4. Incorporar el merengue con los ingredientes del otro bowl con movimientos envolventes.
5. Con una manga, colocar el macaronage en una bandeja con papel manteca o placa de silicona.
6. Dar unos golpes a la bandeja para sacar el aire del interior de las masas.
7. Esperar a que sequen las masas unos minutos. Deberían quedar con una capa de "piel" en la superficie.
8. A un horno medio/bajo hasta que el exterior endurezca solo un poco.

### Relleno de :🍫: Chocolate

1. Mezclar :RecipeAmount[la bebida alcohólica]{ingredient="liquor"} con :RecipeAmount[el café instantáneo]{ingredient="coffee"}
2. Integrar esta mezcla con :RecipeAmount[el dulce de leche]{ingredient="dulce-de-leche"}
3. Derretir :RecipeAmount[el chocolate semiamargo]{ingredient="chocolate"}
4. Mezclar el chocolate derretido con la mezcla anterior
::
