{#

Expects
{
  items: [{
    text: '',
    url: '',
    class: ''?,
  }],
  title: {
    text: {
      mobile: '',
      larger: ''
    },
    url: '',
  },
  seal_link: ''?
}

#}

{% set navItemClass = 'nav__item' %}

{% for item in items %}
  {% if loop.first %}
  <header class="nav__container">
    <nav class="nav">

      <div class="nav__list">
        <h3 class="nav__current">
          {% set titleAttributes = 'data-nav-type="title"' %}
          {% if title.url %}
            {% set titleAttributes = titleAttributes + ' data-nav-url="' + title.url + '" ' %}
          {% endif %}
          <span class="nav__text" {{ titleAttributes|safe }}>
          {% if title && title.text %}
            <span class="nav__text--mobile">{{ title.text.mobile }}</span>
            <span class="nav__text--larger">{{ title.text.larger }}</span>
          {% endif %}
          </span>
          <span class="nav__open">
            {% include 'templates/partials/components/nav/arrow-down.svg' %}
          </span>
        </h3>
        <ul class="nav__items">
          <li class="nav__close">
            {% include 'templates/partials/components/nav/arrow-up.svg' %}
          </li>
    {% set group_name = item.type %}
  {% endif %}

  {% if group_name !== item.type && ! loop.last %}
          <li class="nav-group-break"><hr></li>
  {% endif %}

          {% set itemAttributes = 'data-nav-url="' + item.url + '" ' +
            'data-nav-type="' + item.type + '"' %}
          <li class="{{ navItemClass }}" {{ itemAttributes|safe }}> 
            <a
              href="{{ item.url }}"
              {{ openInNewWindowIfExternalLink(item.url) }}>
              {% if item.html %}
                {{ item.html|safe }}
              {% else %}
                {{ item.text }}
              {% endif %}

              {% if item.type === 'button' %}
                <span class="nav__text--external">
                  {% include 'templates/partials/components/nav/arrow-right.svg' %}
                </span>
              {% endif %}
            </a>
          </li>

  {% set group_name = item.type %}

  {% if loop.last %}

          {% if title.text && title.url %}
          <li class="{{ navItemClass }}" {{ titleAttributes|safe }}>
            <a
              href="{{ title.url }}"
              {{ openInNewWindowIfExternalLink(title.url) }}>
              <span class="nav__text--mobile">{{ title.text.mobile }}</span>
              <span class="nav__text--larger">{{ title.text.larger }}</span>
            </a>
          </li>
          {% endif %}
          
        </ul>
      </div>
      <div class="nav__seal">
        {% if seal_link %}
          <a href="{{ seal_link }}"
            {{ openInNewWindowIfExternalLink(seal_link) }}>
        {% endif %}
          {% include 'templates/partials/components/nav/simplified-seal.html' %}
        {% if seal_link %}
          </a>
        {% endif %}
      </div>
    </nav>
  </header>
  {% endif %}
{% endfor %}
