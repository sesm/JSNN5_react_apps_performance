import React, { Component } from 'react';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {
    DropDownMenu,
    MenuItem,
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
    TextField,
    Toolbar,
    ToolbarGroup,
    ToolbarTitle
} from 'material-ui';
import {connect} from 'react-redux';
import {setFilter, setSort} from './actonCreators.js';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

class App extends Component {
    render() {
        let {items, sort, filter, onFilter, onSort} = this.props;
        return (
            <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
                <div>
                    <Toolbar>
                        <ToolbarGroup style={{flex: '1'}} >
                            <ToolbarTitle text="Search"/>
                            <TextField
                                style={{flex: '1'}}
                                name="filter"
                                value={filter}
                                onChange={onFilter}
                            />
                        </ToolbarGroup>
                        <ToolbarGroup style={{alignItems: 'stretch'}}>
                            <ToolbarTitle text="Sort by"/>
                            <DropDownMenu
                                style={{width: 200}}
                                value={sort}
                                onChange={onSort}
                            >
                                <MenuItem value="id" primaryText="ID"/>
                                <MenuItem value="first_name" primaryText="First Name"/>
                                <MenuItem value="last_name" primaryText="Last Name"/>
                                <MenuItem value="email" primaryText="E-mail"/>
                            </DropDownMenu>
                        </ToolbarGroup>
                    </Toolbar>
                    <Table>
                        <TableHeader displaySelectAll={false}>
                            <TableRow>
                                <TableHeaderColumn>ID</TableHeaderColumn>
                                <TableHeaderColumn>First Name</TableHeaderColumn>
                                <TableHeaderColumn>Last Name</TableHeaderColumn>
                                <TableHeaderColumn>Email</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody displayRowCheckbox={false}>
                            {items.map(item => <TableRow key={item.id}>
                                <TableRowColumn>{item.id}</TableRowColumn>
                                <TableRowColumn>{item.first_name}</TableRowColumn>
                                <TableRowColumn>{item.last_name}</TableRowColumn>
                                <TableRowColumn>{item.email}</TableRowColumn>
                            </TableRow>)}
                        </TableBody>
                    </Table>
                </div>
            </MuiThemeProvider>
        );
    }
}


function mapStateToProps(state) {
    let items = state.items
        .sort((a,b) => {
            let aProp = a[state.sort];
            let bProp = b[state.sort];
            switch(typeof aProp) {
                case 'number':
                    return aProp - bProp;
                case 'string':
                    return aProp.localeCompare(bProp);
                default:
                    return 0;
            }
        })
        .filter(item =>
            item.first_name.includes(state.filter) ||
            item.last_name.includes(state.filter) ||
            item.email.includes(state.filter)
        );
    return {
        items: items,
        sort: state.sort,
        filter: state.filter
    }
}

function mapDisplatchToProps(dispatch) {
    return {
        onFilter: event => dispatch(setFilter(event.target.value)),
        onSort: (event,key,payload) => dispatch(setSort(payload))
    }
}

export default connect(mapStateToProps, mapDisplatchToProps)(App);
