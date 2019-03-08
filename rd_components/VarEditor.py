# AUTO GENERATED FILE - DO NOT EDIT

from dash.development.base_component import Component, _explicitize_args


class VarEditor(Component):
    """A VarEditor component.
VarEditor component

Keyword arguments:
- id (string; optional): The ID used to identify this component in Dash callbacks
- className (string; optional): ClassName
- data (optional): Data. data has the following type: dict containing keys 'id', 'module_id', 'variables'.
Those keys have the following types:
  - id (number; optional)
  - module_id (number; optional)
  - variables (list; required)
- n_clicks_timestamp (number; optional): An integer that represents the time (in ms since 1970)
at which n_clicks changed. This can be used to tell
which button was changed most recently.
- placeholder (string; optional): Placeholder
- show (boolean; optional): Should the element be shown
- style (dict; optional): Defines CSS styles which will override styles previously set."""
    @_explicitize_args
    def __init__(self, id=Component.UNDEFINED, className=Component.UNDEFINED, data=Component.UNDEFINED, n_clicks_timestamp=Component.UNDEFINED, placeholder=Component.UNDEFINED, show=Component.UNDEFINED, style=Component.UNDEFINED, **kwargs):
        self._prop_names = ['id', 'className', 'data', 'n_clicks_timestamp', 'placeholder', 'show', 'style']
        self._type = 'VarEditor'
        self._namespace = 'rd_components'
        self._valid_wildcard_attributes =            []
        self.available_properties = ['id', 'className', 'data', 'n_clicks_timestamp', 'placeholder', 'show', 'style']
        self.available_wildcard_properties =            []

        _explicit_args = kwargs.pop('_explicit_args')
        _locals = locals()
        _locals.update(kwargs)  # For wildcard attrs
        args = {k: _locals[k] for k in _explicit_args if k != 'children'}

        for k in []:
            if k not in args:
                raise TypeError(
                    'Required argument `' + k + '` was not specified.')
        super(VarEditor, self).__init__(**args)

    def __repr__(self):
        if(any(getattr(self, c, None) is not None
               for c in self._prop_names
               if c is not self._prop_names[0])
           or any(getattr(self, c, None) is not None
                  for c in self.__dict__.keys()
                  if any(c.startswith(wc_attr)
                  for wc_attr in self._valid_wildcard_attributes))):
            props_string = ', '.join([c+'='+repr(getattr(self, c, None))
                                      for c in self._prop_names
                                      if getattr(self, c, None) is not None])
            wilds_string = ', '.join([c+'='+repr(getattr(self, c, None))
                                      for c in self.__dict__.keys()
                                      if any([c.startswith(wc_attr)
                                      for wc_attr in
                                      self._valid_wildcard_attributes])])
            return ('VarEditor(' + props_string +
                   (', ' + wilds_string if wilds_string != '' else '') + ')')
        else:
            return (
                'VarEditor(' +
                repr(getattr(self, self._prop_names[0], None)) + ')')
