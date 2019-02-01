import rd_components
import dash
from dash.dependencies import Input, Output
import dash_html_components as html

app = dash.Dash(__name__)

app.scripts.config.serve_locally = True
app.css.config.serve_locally = True

app.layout = html.Div([
    rd_components.Input(id="input", style={'border': '1px solid red'}, value='hej'),
    html.Div(id='output'),
    html.Button('show input', id="toggle"),
])

@app.callback(
    Output('output', 'children'),
    [
        Input('input', 'value'),
        Input('input', 'n_clicks_timestamp'),
    ]
)
def display_output(value, ts):
    print(f'ts: {ts}')
    return 'You have entered {}'.format(value)

@app.callback(
    Output('input', 'show'),
    [
        Input('toggle', 'n_clicks_timestamp'),
    ]
)
def display_output(ts):
    if not ts:
        return False
    else:
        return True


if __name__ == '__main__':
    app.run_server(debug=True, port=8888)
