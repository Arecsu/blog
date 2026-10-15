---
title: Torta de Chocolate Stout
icon: fluent-emoji:chocolate-bar
alt: Torta de Chocolate Stout
draft: true
inlineAmounts: true
ingredientGroups:
  - id: bizcochuelo-de-chocolate-y-stout
    label: Bizcochuelo de chocolate y stout
    items:
      - { id: stout, label: Cerveza stout negra, quantity: 360, unit: g }
      - { id: butter, label: ';🧈; Manteca', quantity: 340, unit: g, note: cortada en cubos }
      - { id: cocoa, label: ';🍫; Cacao amargo', quantity: 180, unit: g }
      - { id: flour, label: Harina común, quantity: 360, unit: g, note: '0000' }
      - { id: sugar, label: Azúcar, quantity: 550, unit: g }
      - { id: baking-soda, label: Bicarbonato de sodio, quantity: 1.5, unit: cdta }
      - { id: salt, label: Sal fina, quantity: 1.5, unit: cdta }
      - { id: sour-cream, label: Crema agria casera, quantity: 240, unit: g, note: '{240 ml} de crema de leche + {1.5 cdta} de jugo de limón o vinagre blanco, reposada 10 min' }
      - { id: eggs, label: ';🥚; Huevos grandes', quantity: 3, whole: true, note: a temperatura ambiente }
  - id: salsa-de-caramelo-salado
    label: Salsa de caramelo salado NEED COMPLETE REWORK
    items:
      - id: caramel-cream
        label: ';🥛; Crema de leche'
        quantity: 240
        unit: g
        allocations:
          - { id: start, label: Al principio, quantity: 120 }
          - { id: end, label: Al final, quantity: 120 }
      - { id: white-sugar, label: Azúcar blanca, quantity: 50, unit: g }
      - { id: brown-sugar, label: Azúcar rubia clara, quantity: 50, unit: g }
      - { id: caramel-butter, label: ';🧈; Manteca sin sal', quantity: 60, unit: g }
      - { id: glucose, label: ';🍯; Glucosa', quantity: 3, unit: cda, note: reemplazo del jarabe de maíz }
      - { id: caramel-salt, label: Sal, quantity: 0.25, unit: cdta }
      - { id: caramel-vanilla, label: Esencia de vainilla, quantity: 1, unit: cdta }
  - id: buttercream-de-caramelo-y-queso-crema
    label: Buttercream de caramelo y queso crema
    items:
      - { id: frosting-butter, label: ';🧈; Manteca sin sal', quantity: 225, unit: g, note: 'fría, cortada en cubos' }
      - id: icing-sugar
        label: Azúcar impalpable
        quantity: 875
        unit: g
        note: tamizada
        allocations:
          - { id: first, label: Al principio, quantity: 375 }
          - { id: rest, label: El resto, quantity: 500 }
      - { id: frosting-cream, label: ';🥛; Crema de leche', quantity: 30, unit: g, note: 'solo {2 cda}' }
      - { id: frosting-caramel, label: Salsa de caramelo salado, quantity: 120, unit: g, prepared: true, note: de los ingredientes anteriores }
      - { id: cream-cheese, label: Queso crema tipo Philadelphia, quantity: 115, unit: g, note: a temperatura ambiente }
---

::RecipeIngredients
::

::RecipeProcess{:process="true"}

:📺: **Inspirada en:** Ovenly Bakery, Brooklyn (EE. UU.)

**Rinde:** 1 torta de dos capas (23 cm de diámetro)

### Bizcochuelo de chocolate y stout

1. Precalentar el horno a 180 °C.
2. Enmantecar y enharinar dos moldes redondos de 23 cm. Colocar papel manteca en la base y enmantecar el papel también.
3. En una olla grande, calentar :RecipeAmount[la cerveza]{ingredient="stout"} con :RecipeAmount[la manteca]{ingredient="butter"} hasta que hierva suavemente.
4. Retirar del fuego, agregar :RecipeAmount[el cacao]{ingredient="cocoa"} y batir hasta que quede una mezcla lisa y brillante.
5. Dejar enfriar unos 5 minutos.
6. En un bol grande, mezclar :RecipeAmount[la harina]{ingredient="flour"}, :RecipeAmount[el azúcar]{ingredient="sugar"}, :RecipeAmount[el bicarbonato]{ingredient="baking-soda"} y :RecipeAmount[la sal]{ingredient="salt"}.
7. En otro bol, batir :RecipeAmount[la crema agria]{ingredient="sour-cream"} con :RecipeAmount[los huevos]{ingredient="eggs"} hasta que se integren.
8. Verter la mezcla de cerveza y manteca sobre la mezcla de crema y huevos.
9. Batir hasta unir, luego agregar los ingredientes secos.
10. Mezclar con espátula hasta que la preparación quede uniforme y sin grumos.
11. Dividir la mezcla en partes iguales entre los moldes y hornear durante **35–40 minutos**, o hasta que al insertar un palillo salga limpio.
12. Enfriar sobre una rejilla.

### Salsa de caramelo salado

**Rinde:** aproximadamente 360 ml (1½ tazas)

1. En una olla mediana, calentar :RecipeAmount[la crema]{ingredient="caramel-cream" allocation="start"} con los azúcares, :RecipeAmount[la manteca]{ingredient="caramel-butter"}, :RecipeAmount[la glucosa]{ingredient="glucose"} y :RecipeAmount[la sal]{ingredient="caramel-salt"} a fuego medio-alto.
2. Revolver hasta que los azúcares se disuelvan.
3. Continuar la cocción hasta que la mezcla tome un color ámbar y espese (unos 125 °C, si tenés termómetro).
4. Retirar del fuego y añadir :RecipeAmount[**la crema restante**]{ingredient="caramel-cream" allocation="end"} y :RecipeAmount[la esencia de vainilla]{ingredient="caramel-vanilla"} con cuidado (puede salpicar).
5. Volver al fuego bajo y batir 30–45 segundos hasta obtener una textura lisa y homogénea.
6. Verter en un frasco de vidrio resistente al calor y dejar enfriar.
7. Guardar en la heladera o freezer. Recalentar a baño maría o en microondas antes de usar.

### Buttercream de caramelo y queso crema

;⚠️; **Importante**: Esta NO es una buttercream normal. Usamos muy poca crema al principio, porque el caramelo reemplaza el resto de la crema.

1. Cortar :RecipeAmount[la manteca]{ingredient="frosting-butter"} en cubos y dejarla ablandar ligeramente hasta temperatura ambiente.
2. En batidora con paleta, mezclar la manteca, :RecipeAmount[una parte del azúcar impalpable]{ingredient="icing-sugar" allocation="first"} y **solo** :RecipeAmount[la crema]{ingredient="frosting-cream"} a baja velocidad hasta que se incorpore.
3. Batir a velocidad media-alta por 1 minuto, hasta obtener una mezcla cremosa.
4. Agregar :RecipeAmount[el resto del azúcar impalpable]{ingredient="icing-sugar" allocation="rest"} de a una taza (125 g aprox.) y mezclar a baja velocidad después de cada adición.
5. Agregar :RecipeAmount[la **salsa de caramelo salado**]{ingredient="frosting-caramel"} y mezclar a baja velocidad hasta incorporar. El caramelo reemplaza la crema extra que normalmente se usaría.
6. Batir a velocidad media-alta hasta que quede esponjoso y cremoso.
7. Agregar :RecipeAmount[el **queso crema**]{ingredient="cream-cheese"} y batir 1 minuto a velocidad media-alta hasta integrar completamente. Raspar el fondo del bowl con una espátula para asegurar que se incorpore todo.
8. Ajustar la textura si es necesario:
   - Si está muy espeso, agregar crema de leche de a 1 cda.
   - Si está muy fluido, incorporar azúcar impalpable de a 1 cda colmada.

### Armado y cobertura

1. Nivelar las capas con un cuchillo serrado si se formó una "panza".
2. Colocar una base o bandeja con una cucharada de buttercream en el centro y apoyar la primera capa.
3. Cubrir con buttercream (aprox. 1 cm de grosor).
4. Apoyar la segunda capa y presionar suavemente.
5. Cubrir todo el pastel con una capa fina (*crumb coat*) y llevar al freezer por 30 min.
6. Aplicar la capa final de buttercream, alisando con una espátula o cuchillo plano.
7. (Opcional) Usar una manga con boquilla redonda N.º 5 para decorar con perlas de buttercream.

::
