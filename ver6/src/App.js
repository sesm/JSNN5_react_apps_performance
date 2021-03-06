import React, { Component, PureComponent } from 'react';
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
import ReactList from 'react-list';
import {connect} from 'react-redux';
import {setFilter, setSort} from './actonCreators.js';
import shallowEqual from 'fbjs/lib/shallowEqual';
import md5 from 'blueimp-md5';
import {createSelector} from 'reselect';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

function fuzzySearch(input, search) {
    input = input.toUpperCase();
    search = search.toUpperCase();
    let positions = [];
    let lastIndex = 0;
    for(let i = 0; i < search.length; i++) {
        let char = search.charAt(i);
        let index = input.indexOf(char, lastIndex);
        if(index == -1) {
            return [];
        } else {
            positions.push(index);
            lastIndex=index+1;
        }
    }
    return positions;
}

class Row extends Component {
    shouldComponentUpdate(nextProps) {
        let {item} = this.props;
        return !shallowEqual(item, nextProps.item);
    }
    render() {
        let {item} = this.props;

        let firstName = item.first_name;
        let lastName = item.last_name;
        let email = item.email;

        return <TableRow key={item.id}>
            <TableRowColumn>{item.id}</TableRowColumn>
            <TableRowColumn>{firstName}</TableRowColumn>
            <TableRowColumn>{lastName}</TableRowColumn>
            <TableRowColumn>{email}</TableRowColumn>
        </TableRow>;
    }
}

class FilterGroup extends Component {
    shouldComponentUpdate(nextProps) {
        let {sort} = this.props;
        return sort != nextProps.sort;
    }
    render() {
        let {sort, onSort} = this.props;
        return <ToolbarGroup style={{alignItems: 'stretch'}}>
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
                <MenuItem value="hash" primaryText="Hash"/>
            </DropDownMenu>
        </ToolbarGroup>
    }
}

class App extends Component {
    _renderTable = (items, ref) =>
        <Table>
            <TableHeader displaySelectAll={false}>
                <TableRow>
                    <TableHeaderColumn>ID</TableHeaderColumn>
                    <TableHeaderColumn>First Name</TableHeaderColumn>
                    <TableHeaderColumn>Last Name</TableHeaderColumn>
                    <TableHeaderColumn>Email</TableHeaderColumn>
                </TableRow>
            </TableHeader>
            <TableBody
                ref={ref}
                displayRowCheckbox={false}>
                {items}
            </TableBody>
        </Table>;

    _renderRow = (index, key) => {
        let {items} = this.props;
        let item = items[index];

        return <Row key={index} item={item}/>;
    };

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
                        <FilterGroup sort={sort} onSort={onSort}/>
                    </Toolbar>
                    <ReactList
                        itemRenderer={this._renderRow}
                        itemsRenderer={this._renderTable}
                        length={items.length}
                        type="uniform"
                    />
                </div>
            </MuiThemeProvider>
        );
    }
}

const itemsSelector = state => state.items;
const sortSelector = state => state.sort;
const filterSelector = state => state.filter;

const sortedListSelector = createSelector(
    itemsSelector,
    sortSelector,
    (items, sort) => items.sort(
        (a,b) => {
            if (sort == 'hash') {
                let aHash = md5(a.email);
                let bHash = md5(b.email);
                return aHash.localeCompare(bHash);
            } else {
                let aProp = a[sort];
                let bProp = b[sort];
                switch (typeof aProp) {
                    case 'number':
                        return aProp - bProp;
                    case 'string':
                        return aProp.localeCompare(bProp);
                    default:
                        return 0;
                }
            }
        }
    )
);

const totalSelector = createSelector(
    sortedListSelector,
    filterSelector,
    sortSelector,
    (list, filterStr, sort) => ({
        items: list.filter(item =>
            filterStr.length == 0 ||
            fuzzySearch(item.first_name, filterStr).length > 0 ||
            fuzzySearch(item.last_name, filterStr).length > 0 ||
            fuzzySearch(item.email, filterStr).length > 0),
        sort: sort,
        filter: filterStr
    })
);

function mapDisplatchToProps(dispatch) {
    return {
        onFilter: event => dispatch(setFilter(event.target.value)),
        onSort: (event,key,payload) => dispatch(setSort(payload))
    }
}

export default connect(totalSelector, mapDisplatchToProps)(App);
