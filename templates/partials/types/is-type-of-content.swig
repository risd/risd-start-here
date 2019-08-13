{% if item.question || item.answer %}
  {% set item._is_question = true %}
{% elseif item.gallery_title ||
          item.gallery_description ||
          item.gallery_content %}
  {% set item._is_gallery = true %}
{% elseif item.link_text %}
  {% set item._is_link = true %}
{% endif %}
