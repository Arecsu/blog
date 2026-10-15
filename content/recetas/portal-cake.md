---
title: Portal Cake
icon: fluent-emoji:chocolate-bar
alt: Torta selva negra con frutos rojos
inlineAmounts: true
ingredientGroups:
  - id: nota
    label: Nota
    note: Versión adaptada de la Selva Negra clásica, reemplazando las cerezas en almíbar por frutos rojos congelados. Rinde para un bizcochuelo de tres capas, cada capa de 21cm de diametro.
    items: []
  - id: buttermilk
    label: Buttermilk
    items:
      - { id: milk, label: ';🥛; Leche entera', quantity: 360, unit: ml }
      - { id: lemon-juice, label: '{} ({1.5 cucharada}) Jugo de limón o vinagre blanco', quantity: 22, unit: ml }
  - id: bizcochuelo
    label: Bizcochuelo
    items:
      - { id: flour, label: ';🌽; Harina 0000', quantity: 200, unit: g }
      - { id: cocoa, label: ';🍫; Cacao amargo de buena calidad', quantity: 65, unit: g }
      - { id: sugar, label: Azúcar, quantity: 300, unit: g }
      - { id: butter, label: ';🧈; Manteca, a temperatura ambiente', quantity: 113, unit: g }
      - { id: eggs, label: ';🥚; Huevos grandes', quantity: 2, whole: true }
      - { id: baking-soda, label: Bicarbonato de sodio, quantity: 7, unit: g }
      - { id: salt, label: ';🧂; Sal fina', quantity: 5, unit: g }
      - { id: vanilla, label: Esencia de vainilla, quantity: 5, unit: ml }
      - { id: cake-buttermilk, label: Buttermilk, quantity: 360, unit: ml, prepared: true, note: ver arriba }
      - { id: cake-juice, label: Jugo colado de la salsa de frutos rojos, quantity: 120, unit: g, prepared: true, note: ver abajo }
  - id: salsa-de-frutos-rojos
    label: Salsa de frutos rojos
    note: Se usa tanto para el relleno como para el almíbar y el jugo del bizcochuelo. Conviene prepararla primero.
    items:
      - { id: berries, label: ';🍓; Frutos rojos congelados', quantity: 500, unit: g }
      - { id: sauce-sugar, label: Azúcar, quantity: 200, unit: g }
  - id: relleno-y-cobertura-chantilly-de-cacao
    label: Relleno y cobertura (chantilly de cacao)
    items:
      - { id: cocoa-cream, label: Crema de leche bien fría, quantity: 700, unit: ml, note: mínimo 35% de grasa }
      - { id: icing-sugar, label: Azúcar impalpable, quantity: 60, unit: g }
      - { id: chantilly-cocoa, label: ';🍫; Cacao amargo', quantity: 20, unit: g }
      - { id: liqueur, label: Licor de almendras y chocolate, quantity: 15, quantityMax: 20, unit: ml }
  - id: decoracion
    label: Decoración
    items:
      - { id: chocolate, label: ';🍫; Chocolate semiamargo', quantity: 100, unit: g }
      - { id: white-cream, label: Crema de leche, quantity: 100, unit: g }
      - { id: white-sugar, label: Azúcar, quantity: 20, unit: g }
      - { id: white-vanilla, label: Esencia de vainilla }
      - { id: cherries, label: ';🍒; Cerezas al marraschino', quantity: 8, whole: true, note: sin cadete }
  - id: etc
    label: Etc
    items:
      - { id: sieve, label: Colador tamizador }
      - { id: brush, label: Pincel de cocina }
      - { id: piping, label: Manga o cuchara para los picos de chantilly }
      - { id: knife, label: Cuchillo para rallar el chocolate }
---

::RecipeIngredients
::

::RecipeProcess{:process="true"}

### Buttermilk

Mezclar :RecipeAmount[la leche entera]{ingredient="milk"} con :RecipeAmount[el jugo de limón o vinagre]{ingredient="lemon-juice"}. Dejar reposar 10-15 minutos hasta que se corte levemente. Reservar.

### Salsa de frutos rojos

1. Calentar en una olla :RecipeAmount[los frutos rojos congelados]{ingredient="berries"} junto con :RecipeAmount[el azúcar]{ingredient="sauce-sugar"}, revolviendo de tanto en tanto.
2. Cocinar hasta que los frutos se deshagan y se forme una salsa homogénea.
3. Colar la preparación, separando el líquido (jugo) de la parte sólida.

De este colado se obtienen dos cosas: el **jugo**, que se usa para el bizcochuelo y como almíbar de armado, y la **fruta colada**, que se usa como relleno entre capas. Si sobra jugo, se puede guardar para servir a un costado de cada porción.

### Bizcochuelo

1. Precalentar el horno a 180°C.
2. En un bowl, tamizar juntos :RecipeAmount[la harina]{ingredient="flour"}, :RecipeAmount[el cacao]{ingredient="cocoa"}, :RecipeAmount[el bicarbonato]{ingredient="baking-soda"} y :RecipeAmount[la sal]{ingredient="salt"}.
3. En otro bowl, batir :RecipeAmount[la manteca]{ingredient="butter"} con :RecipeAmount[el azúcar]{ingredient="sugar"} hasta que quede cremosa.
4. Agregar :RecipeAmount[los huevos]{ingredient="eggs"} de a uno, batiendo bien después de cada uno, y luego :RecipeAmount[la esencia de vainilla]{ingredient="vanilla"}.
5. Incorporar los secos tamizados alternando con :RecipeAmount[el buttermilk]{ingredient="cake-buttermilk"} y :RecipeAmount[el jugo de frutos rojos]{ingredient="cake-juice"}, en 3 tandas, empezando y terminando con los secos. Mezclar solo hasta integrar.
6. Dividir la masa en 3 moldes iguales (o cocinar en tandas con un mismo molde).
7. Hornear 20-25 minutos, o hasta que un palillo salga limpio.
8. Dejar enfriar por completo antes de armar.

### Chantilly de cacao (relleno y cobertura)

1. Batir :RecipeAmount[la crema de leche bien fría]{ingredient="cocoa-cream"} con :RecipeAmount[el azúcar impalpable]{ingredient="icing-sugar"} y :RecipeAmount[el cacao]{ingredient="chantilly-cocoa"} hasta llegar a picos suaves-medios.
2. Agregar :RecipeAmount[el licor de almendras y chocolate]{ingredient="liqueur"}, y seguir batiendo hasta lograr picos firmes. No pasarse de batido.

### Chantilly blanca (decoración)

Batir :RecipeAmount[la crema de leche]{ingredient="white-cream"} con :RecipeAmount[el azúcar]{ingredient="white-sugar"} y la esencia de vainilla hasta lograr picos firmes. Reservar en frío hasta el armado final.

### Chocolate rallado

Con un cuchillo, rallar :RecipeAmount[el chocolate semiamargo]{ingredient="chocolate"} (frío o congelado) en ángulo de 45-60°, generando virutas tipo aserrín. Reservar en frío.

### Armado

Con un tenedor, pinchar suavemente toda la superficie de cada capa de bizcochuelo y humedecer con el jugo de frutos rojos.

Desde la base hacia arriba:

1. Capa de bizcochuelo (base) → humedecer
2. Chantilly de cacao
3. Salsa de frutos rojos (la parte sólida colada)
4. Capa de bizcochuelo → humedecer
5. Chantilly de cacao
6. Salsa de frutos rojos
7. Capa de bizcochuelo (tapa) → humedecer

Cubrir toda la torta (parte superior y laterales) con el resto de la chantilly de cacao.

### Decoración final

1. Esparcir el chocolate rallado sobre toda la cobertura de la torta.
2. Con la chantilly blanca, formar 8 picos en círculo sobre el borde superior de la torta.
3. Coronar cada pico con una cereza al marraschino.

::
