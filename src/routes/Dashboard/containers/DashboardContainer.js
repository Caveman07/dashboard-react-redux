import React from 'react'
import { connect } from 'react-redux'
import { dashboardVisitIncrement,
         dashboardAddItem,
         dashboardEditItem
        } from '../modules/dashboard'

/*  This is a container component. Notice it does not contain any JSX,
    nor does it import React. This component is **only** responsible for
    wiring in the actions and state necessary to render a presentational
    component - in this case, the Dashboard:   */

import Dashboard from 'components/Dashboard'

/*  Object of action creators (can also be function that returns object).
    Keys will be passed as props to presentational components. Here we are
    implementing our wrapper around increment; the component doesn't care   */

const mapActionCreators = {
  dashboardVisitIncrement: () => dashboardVisitIncrement(1),
  dashboardAddItem: (value) => dashboardAddItem(value),
  dashboardEditItem: (value) => dashboardEditItem(value)
}

const mapStateToProps = (state) => ({
  dashboard: state.dashboard
})

class DashboardContainer extends React.Component {
  constructor(props) {
    super(props)

    this.inputOnChange = this.inputOnChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.itemOnEdit = this.itemOnEdit.bind(this)

    this.state = {
      inputValue: '',
      editedItemIndex: null
    }
  }

  componentDidMount() {
    this.props.dashboardVisitIncrement()
  }

  inputOnChange(e) {
    this.setState({ inputValue: e.target.value })
  }

  inputOnEdit(itemIndex) {
    const editedItem = this.props.dashboard.dashboardItems[itemIndex]
    this.setState({ inputValue: editedItem.label, editedItemIndex: itemIndex })
  }

  onSubmit(e) {
    e.preventDefault()
    const val = this.state.inputValue
    const editedItemIndex = this.state.editedItemIndex
    if(val && editedItemIndex !== null) {
      this.props.dashboardEditItem({ val, editedItemIndex })
      this.setState({ inputValue: '', editedItemIndex: null })
    } else if(val) {
      this.props.dashboardAddItem(val)
      this.setState({ inputValue: '' })
    } else {
      alert("Value can't be empty")
    }
  }

  render() {
    return(
      <Dashboard {...this.props}
      editedItemIndex={this.state.editedItemIndex}
      itemOnEdit={this.itemOnEdit}
      inputValue={this.state.inputValue}
      inputOnChange={this.inputOnChange}
      onSubmit={this.onSubmit} />
    );
  }
}



/*  Note: mapStateToProps is where you should use `reselect` to create selectors, ie:

    import { createSelector } from 'reselect'
    const Dashboard = (state) => state.Dashboard
    const tripleCount = createSelector(Dashboard, (count) => count * 3)
    const mapStateToProps = (state) => ({
      Dashboard: tripleCount(state)
    })

    Selectors can compute derived data, allowing Redux to store the minimal possible state.
    Selectors are efficient. A selector is not recomputed unless one of its arguments change.
    Selectors are composable. They can be used as input to other selectors.
    https://github.com/reactjs/reselect    */

export default connect(mapStateToProps, mapActionCreators)(DashboardContainer)
