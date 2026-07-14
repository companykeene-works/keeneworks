# Keene Works — strona internetowa

Responsywna, jednostronicowa witryna Keene Works przygotowana w semantycznym HTML, CSS i czystym JavaScript. Projekt nie wymaga instalowania zależności ani procesu budowania.

## Uruchomienie

Najprościej otworzyć plik `index.html` bezpośrednio w przeglądarce.

Zalecane jest jednak uruchomienie prostego serwera lokalnego, np.:

```powershell
python -m http.server 4173
```

Następnie otwórz `http://localhost:4173`.

## Struktura

- `index.html` — treść, semantyka i metadane SEO,
- `styles.css` — pełny layout, animacje i widoki responsywne,
- `script.js` — menu mobilne, animacje wejścia i obsługa formularza,
- `favicon.svg` — znak strony,
- `site.webmanifest`, `robots.txt`, `sitemap.xml` — podstawowa konfiguracja PWA/SEO.

## Formularz kontaktowy

Formularz waliduje dane i otwiera program pocztowy użytkownika z gotową wiadomością do `kontakt@keeneworks.pl`. Po wyborze docelowego hostingu można go łatwo podłączyć do własnego API lub usługi formularzy, zastępując końcową część obsługi zdarzenia `submit` w `script.js`.

## Publikacja

Cały katalog można wdrożyć jako stronę statyczną (np. Netlify, Cloudflare Pages, GitHub Pages lub dowolny hosting WWW). Przed publikacją upewnij się, że domena `keeneworks.pl` oraz adres `kontakt@keeneworks.pl` są właściwe.

## Dodawanie realizacji do portfolio

Projekty portfolio znajdują się w katalogu `keene portfolio`. Każda realizacja ma własny podfolder z plikiem `index.html` oraz potrzebnymi zasobami.

Aby dodać kolejny projekt:

1. skopiuj kompletną stronę do nowego podfolderu w `keene portfolio`,
2. w sekcji `#realizacje` pliku `index.html` skopiuj jeden element `.project-card`,
3. zmień nazwę, opis, kategorię oraz ścieżki `data-project-src` i `data-preview-src`,
4. zwiększ numer realizacji w `.project-meta`.

Wspólne okno podglądu i jego obsługa nie wymagają dalszych zmian w JavaScript.
