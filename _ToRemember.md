# RAPPEL

## INSTALLATION POUR UNE WEBAPP
- npx create-react-app [MONAPP]
- npm install --save-dev tslint typescript @types/node @types/react @types/react-dom @types/jest
- npm install cloudinary-react --save
- Renommer les js en .tsx dans src
- Copier tslint et remplacer tsconfig
- Ajouter un .htaccess dans public contenant :
  ```apache
    Options -MultiViews
    RewriteEngine On
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^ index.html [QSA,L]
  ```
- Copier ce qu'il y a dans public
- conf JSON : launch.json à récupérer
- Penser a changer
  ```javascript
    serviceWorker.unregister();
  ```
  en
  ```javascript
    serviceWorker.register();
  ```
  dans ```index.tsx``` pour activer le service worker
- Cf. https://facebook.github.io/create-react-app/ pour des infos sur l'installation avec netlify
- L'installation se fait ensuite par dossier avec un index.tsx un name.module.css et un name.test.tsx sauf pour l'index
- Ajouter dans src ```custom.d.ts``` qui permet d'ajouter les package non typescript
- ```react-ink``` sert à faire le ripple effect

=> Pour une librairie utiliser le tsconfig de wapitis et pas besoin de build mais de transpile (à voir si je rajoute)

=> **IMPORTANT : A voir si j'éjecte et que wapitis ne reprenne que ce qui est nécessaire plutot que le create react app**

## WAPITIS
- Génération de code class / component
- Initalisation
- Lancement de dev
- Lancement de prod
- Lancement electron prod / dev

=> Manque Electron + generation de code (pas sur que ce soit intéressant de reprendre à remplacer par snippets ?)

## A UTILISER
- CSS Module qui permet de remplacer en partie shadow dom
- code splitting dans les component
- reactstrap une première approche des components -> A voir Pas celui-ci mais l'un des frameworks sauvegardé - pour whisky Material UI et pour nodeflow blueprint
- @reach-router
- helmet
- Possible de créer un site static si c'est lecas en utilisant react-snapshot qui va créer des pages statiques

Cf. https://facebook.github.io/create-react-app/

A voir si envisageale d'améliorer la gestion de l'import pour le faire comme avant