import json
import rd_components
import dash
from dash.dependencies import Input, Output, State
import dash_html_components as html
from dash.exceptions import PreventUpdate

external_css = [
    {
        'href': 'https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css',
        'rel': 'stylesheet',
        'integrity': 'sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS',
        'crossorigin': 'anonymous'
    },
    {
        'href': 'https://use.fontawesome.com/releases/v5.6.3/css/all.css',
        'rel': 'stylesheet',
        'integrity': 'sha384-UHRtZLI+pbxtHCWp1t77Bi1L4ZtiqrqD80Kn4Z8NTSRyMA2Fd33n5dQ8lWUE00s/',
        'crossorigin': 'anonymous'
    },
]

app = dash.Dash(
    __name__,
    external_stylesheets=external_css
)

app.scripts.config.serve_locally = True
app.css.config.serve_locally = True

app.layout = html.Div([
    rd_components.Input(id="input", style={'border': '1px solid red'}, value='hej'),
    html.Div(id='output'),
    html.Button('Add variable', id="button-add-var"),
    rd_components.VarEditor(id='var-editor'),
])

@app.callback(
    Output('var-editor', 'data'),
    [
        Input('button-add-var', 'n_clicks_timestamp'),
    ]
)
def var_editor_callback(ts):
    print(ts)
    if not ts:
        raise PreventUpdate

    return {'module_id': 1}


@app.callback(
    Output('output', 'children'),
    [
        Input('var-editor', 'submit_timestamp'),
    ],
    [
        State('var-editor', 'data'),
    ],
)
def display_output(ts, data):
    if not ts:
        raise PreventUpdate
    return json.dumps(data, indent=4)

# @app.callback(
#     Output('input', 'show'),
#     [
#         Input('toggle', 'n_clicks_timestamp'),
#     ]
# )
# def display_output(ts):
#     if not ts:
#         return False
#     else:
#         return True


if __name__ == '__main__':
    app.run_server(debug=True, port=8888)
