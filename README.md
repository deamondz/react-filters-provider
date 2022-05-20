## Установка

npm

```
npm install @d.lukyanov/react-filters-provider
```

yarn

```
yarn add @d.lukyanov/react-filters-provider
```

## Особенности

Не зависит от версии `react-router`, при инициализации необходимо передать 2 функции:

- `useNavigate` - переход между страницами
- `setLocation` - получение текущей локации

## Как работает

Содержит 2 стора:

- `tmpFilters` - это промежуточные фильтры, они выполняют функцию хранения состояния фильтров до их применения
- `appliedFilters` - это применённые фильтры, необходимы для непосредственной работы с текущими значениями

```
const [{ tmpFilters, appliedFilters }] = useFilters();

console.log(tmpFilters.page);
console.log(appliedFilters.page);
```

## API

### SET_FILTER

Устанавливает значение ОДНОГО конкретного ПРОМЕЖУТОЧНОГО фильтра

```
const [_, { setFilter }] = useFilters();

setFilter('page', 1);
```

### SET_FILTERS

Устанавливает значения нескольких ПРОМЕЖУТОЧНЫХ фильтров за один раз. Может понадобиться, если реализуется сложносоставной фильтр, например, дата от и до:

```
const [_, { setFilters }] = useFilters();

setFilters({
    created_at__before: '2020-01-02',
    created_at__after: '2020-01-01',
});
```

### RESET_FILTERS

Возвращение к исходным фильтрам, переданным в `initialFilterValues`

### APPLY_FILTER

Устанавливает значение ОДНОГО конкретного ПРИМЕНЁННОГО фильтра, после этого происходит обновление урла

```
const [_, { applyFilter }] = useFilters();

applyFilter('page', 1);
```

### SET_AND_APPLY_FILTERS

Устанавливает и применяет обьект значений и в промежуточные и в применённые фильтры сразу, при этом, затираются все остальные фильтры - т. е. устанавливается только то, что было в аргументе, после этого происходит обновление урла

```
const [_, { setAndApplyFilters }] = useFilters();

setAndApplyFilters({
    page: 1,
    page_size: 10,
    created_at__before: '2020-01-02',
    created_at__after: '2020-01-01',
});
```

### APPLY_FILTERS

Применяет промежуточные фильтры, т. е. по сути, делается `tmpFilters -> appliedFilters`, после этого происходит обновление урла

```
const [_, { applyFilters }] = useFilters();

applyFilters();
```
