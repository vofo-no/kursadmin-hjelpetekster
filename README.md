KursAdmin hjelpetekster
=======================

Applikasjon til å administrere og vise hjelpetekster i KursAdmin. Hjelpetekstene skal gjøre programmet mer brukervennlig og tilgjengelig.

Skisse av teknisk løsning
-------------------------
Hjelpetekstene lagres i JSON-dokumenter (JavaScript Object Notation) som lastes inn dynamisk med KursAdmin. Hjelpetekstene grupperes etter hvilket skjema de skal vises i, slik at bare de aktuelle hjelpetekstene lastes med siden.

Det tas høyde for at tjenesten skal kunne benyttes av andre studieforbund, og enhver hjelpetekst er definert lokalt for ett enkelt studieforbund.

Hver hjelpetekst består av følgende elementer:
- Objekt-ID (obligatorisk): definerer hvilket objekt hjelpeteksten skal bindes til.
- Tittel (obligatorisk)
- Kort hjelpetekst
- Link til video (innbygges)
- Link til "mer informasjon" (åpner i ny fane)

Hjelpeteksten binder et definert hjelpesymbol til det valgte objektet, og vises som en "lapp" på skjermen når brukeren trykker på hjelpesymbolet.

Demonstrasjon: https://hjelpetekst.appspot.com/demo/index.html

Eksempel på JSON-dokument: https://github.com/vofo-no/kursadmin-hjelpetekster/blob/master/demo/1-01.json

[Nettbasert kontrollpanel](https://hjelpetekst.appspot.com) til å administrere hjelpetekstene. Her er det enkelt for administratorer å opprette, endre og forhåndsvise hjelpetekster. Hjelpetekstene fra kontrollpanelet bygges fortløpende og legges rett inn i testmiljøet for KursAdmin, slik at administrator kan se hvordan de fungerer i praksis. Deretter kan de ferdige hjelpetekstene legges ut i produksjon - dette krever et ekstra skritt for å hindre feil.

Hosting og produksjon
---------------------
Løsningen hostes på Google App Engine-platformen, som sørger for enkel, sikker og kostnadseffektiv drift. I utgangspunktet antas det at løsningen ikke vil kreve mer ressurser enn det som dekkes av [Googles gratiskvote](https://developers.google.com/appengine/docs/quotas), slik at hosting ikke vil koste noe for studieforbundet. (Dette er med forbehold om endringer i bruk og i Googles vilkår.)

Det er mulig å skille ut hosting av produksjonsfiler og kontrollpanel på et senere tidspunkt.

Videoer hostes gratis på [YouTube](https://www.youtube.com).

Kildekoden hostes på [GitHub](https://github.com), som tilbyr gratis versjoneringssystem, feilsporing, dokumentasjon og andre nyttige verktøy i bytte mot at koden gjøres offentlig tilgjengelig og kan kopieres, modifiseres og gjenbrukes av andre.

Eierskap og lisens
------------------
Løsningen utvikles av [Voksenopplæringsforbundet](http://www.vofo.no) på oppdrag fra [Studieforbundet Funkis](http://www.funkis.no) i samarbeid med deres medlemsorganisasjoner. Funkis har eierskap til prosjektet og den tekniske løsningen.

Det velges en egnet åpen kildekode-lisens som regulerer vilkår for bruk og gjenbruk av løsningen.

Alt innhold (tekst og video) eies av studieforbundet.
