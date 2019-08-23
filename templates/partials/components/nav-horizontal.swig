{#

Expects
{
  items: [{
    text: '',
    url: '',
  }],
  position: 'top' | 'bottom'
}

#}

{% if !position %}
  {% set position = 'top' %}
{% endif %}
{% for item in items %}
  {% if loop.first %}
  <nav class="nav-horizontal--{{ position }}">
    <ul class="nav-horizontal">
  {% endif %}

      <li class="nav-horizontal__item"> 
        <a
          href="{{ item.url }}"
          {{ openInNewWindowIfExternalLink(item.url) }}>
          {{ item.text }}
        </a>
      </li>

  {% if loop.last %}
    </ul>
  </nav>
  {% endif %}
{% endfor %}
