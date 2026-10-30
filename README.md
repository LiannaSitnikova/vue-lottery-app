# 🎲 Vue Lottery App (FSD Refactored)

Застосунок розроблено з використанням архітектурної методології **Feature-Sliced Design (FSD)**, бібліотеки UI-компонентів **PrimeVue** та менеджеру стану **Pinia**.

---

## 🏗️ Архітектура залежностей шарів (FSD)

Потік залежностей у проєкті чітко дотримується концепції FSD (залежності спрямовані лише зверху вниз):

```mermaid
graph TD
    App[app Layer] --> Pages[pages Layer]
    App --> Widgets[widgets Layer]
    App --> Features[features Layer]
    App --> Entities[entities Layer]
    App --> Shared[shared Layer]

    Pages --> Widgets
    Pages --> Features
    Pages --> Entities
    Pages --> Shared

    Widgets --> Features
    Widgets --> Entities
    Widgets --> Shared

    Features --> Entities
    Features --> Shared

    Entities --> Shared

    classDef appStyle fill:#f9f,stroke:#333,stroke-width:2px;
    classDef pageStyle fill:#bbf,stroke:#333,stroke-width:2px;
    classDef widgetStyle fill:#dfd,stroke:#333,stroke-width:2px;
    classDef featureStyle fill:#fdd,stroke:#333,stroke-width:2px;
    classDef entityStyle fill:#ffd,stroke:#333,stroke-width:2px;
    classDef sharedStyle fill:#dff,stroke:#333,stroke-width:2px;

    class App appStyle;
    class Pages pageStyle;
    class Widgets widgetStyle;
    class Features featureStyle;
    class Entities entityStyle;
    class Shared sharedStyle;
```