# AUTO GENERATED FILE - DO NOT EDIT

from dash.development.base_component import Component, _explicitize_args


class ModuleEditor(Component):
    """A ModuleEditor component.
ModuleEditor component

This component will be shown whenever a new timestamp
is passed via props data object.

Keyword arguments:
- id (string; optional): The ID used to identify this component in Dash callbacks
- className (string; optional): ClassName
- data (optional): Data

moduleId: which module to add var to
variables: array with all project vars
timestamp: must pass a new timestamp to show the component. data has the following type: dict containing keys 'id', 'project_id', 'timestamp', 'image_url', 'name', 'description', 'include_in_report'.
Those keys have the following types:
  - id (number; required)
  - project_id (number; required)
  - timestamp (number; required)
  - image_url (string; optional)
  - name (string; optional)
  - description (string; optional)
  - include_in_report (boolean; optional)
- submit_timestamp (number; optional): An integer that represents the time (in ms since 1970)
at which n_clicks changed. This can be used to tell
which button was changed most recently.
- placeholder (string; optional): Placeholder
- style (dict; optional): Defines CSS styles which will override styles previously set."""
    @_explicitize_args
    def __init__(self, id=Component.UNDEFINED, className=Component.UNDEFINED, data=Component.UNDEFINED, submit_timestamp=Component.UNDEFINED, placeholder=Component.UNDEFINED, style=Component.UNDEFINED, **kwargs):
        self._prop_names = ['id', 'className', 'data', 'submit_timestamp', 'placeholder', 'style']
        self._type = 'ModuleEditor'
        self._namespace = 'rd_components'
        self._valid_wildcard_attributes =            []
        self.available_properties = ['id', 'className', 'data', 'submit_timestamp', 'placeholder', 'style']
        self.available_wildcard_properties =            []

        _explicit_args = kwargs.pop('_explicit_args')
        _locals = locals()
        _locals.update(kwargs)  # For wildcard attrs
        args = {k: _locals[k] for k in _explicit_args if k != 'children'}

        for k in []:
            if k not in args:
                raise TypeError(
                    'Required argument `' + k + '` was not specified.')
        super(ModuleEditor, self).__init__(**args)

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
            return ('ModuleEditor(' + props_string +
                   (', ' + wilds_string if wilds_string != '' else '') + ')')
        else:
            return (
                'ModuleEditor(' +
                repr(getattr(self, self._prop_names[0], None)) + ')')
