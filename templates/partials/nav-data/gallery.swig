{#

Expects
{
  item: {
    _is_gallery: boolean,
    _type: 'gallery',
    number: Int,
    gallery_title: '',
    gallery_question: wysiwyg,
    gallery_content: wysiwyg,
  }
}

#}

{% if item._is_gallery %}
  {% set gallery_id = 'gallery-' + item.number %}

  {% if item.gallery_title %}
    {% set section_label = item.gallery_title|slugify %}
    {% set item.nav = {
      text: item.gallery_title,
      url: '#' + section_label,
    } %}
  {% else %}
    {% set section_label = null %}
    {% set item.nav = {
      text: gallery_id,
      url: '#' + gallery_id,
    } %}
  {% endif %}

  
{% endif %}
