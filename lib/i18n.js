[].forEach.call(document.querySelectorAll("[data-i18n]"), function(el) {
    const name = el.getAttribute("data-i18n");
    const value = $STR(name);
    if (name.startsWith("list_")) {
        const values = value.split(";").map(v => v.trim()).filter(v => v != "");
        if (values.length == 0) {
            el.textContent = "<empty>";
        } else {
            const list = document.createElement("ul");
            for (v of values) {
                const item = createListElement(v);
                list.appendChild(item);
            }
            el.appendChild(list);
        }
    } else {
        el.textContent = value;
    }
  });

  function createListElement (text) {
    const item = document.createElement("li");
    item.textContent = v;
    var options = {
        defaultProtocol: 'https',
        validate: {
            url: function (value) {
              return /^(http)s?:\/\//.test(value);
            }
          }
      };
    linkifyElement(item, options, document);
    return item;
  }
