import React, { Component } from "react";
import { Alert, Button, Col, Form, Navbar, Nav, Spinner, Table } from "react-bootstrap";
import { connect } from "react-redux";
import { compose } from "redux";
import { firestoreConnect } from "react-redux-firebase";
import { getFirebase } from "react-redux-firebase";
import { getFirestore } from "redux-firestore";

class Dashboard extends Component {

  state = {
    name: '',
    quantity: '',
    price: '',
    error: false,
    errorMessage: '',
    isfetching: false,
  }

  // logout user
  _logoutUser(e){
    e.preventDefault();
    const firebase = getFirebase();
    firebase.auth().signOut();
    window.location.reload();
  }

  // Adding new products
  addProducts = async (e) => {
    e.preventDefault();

    const { name, quantity, price } = this.state;
    if(name === ''){
      this.setState({ error: true, errorMessage: 'Product Name is required' });
      return;
    }
    if(quantity === ''){
      this.setState({ error: true, errorMessage: 'Quantity is required' });
      return;
    }
    if(price === ''){
      this.setState({ error: true, errorMessage: 'price is required' });
      return;
    }
    this.setState({ isfetching: true });

    // Insert document to firestore collection products
    const firestore = getFirestore();
    await firestore.add({
      collection: 'products'
    }, {
      name,
      quantity,
      price
    }).then(() => {
      this.setState({ 
        error: false, 
        errorMessage: '', 
        name: '', 
        quantity: '', 
        price: '' 
      });
    }).catch(error => {
      var errorMessage = error.message;
      this.setState({
        error: true,
        errorMessage
      });
    });
    // - Ends

    this.setState({ isfetching: false });
  }

  // Remove Products
  removeProduct = async id => {
    const firestore = getFirestore();

    this.setState({ isfetching: true });

    // Delete document by id from collection products
    await firestore.delete({
      collection: 'products',
      doc: id
    }).then(() => {
      
    }).catch(error => {
      var errorMessage = error.message;
      this.setState({
        error: true,
        errorMessage
      });
    });
    // - Ends


    this.setState({ isfetching: false });
  }

  renderProducts(){
    const { products } = this.props;
    return <Table responsive hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Quantity</th>
            <th>Price (in USD)</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {
              products.map((item, i) => 
                <tr key={`product-${item.id}`}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>{`$ ${item.price}`}</td>
                  <td>
                    <Button onClick={() => this.removeProduct(item.id)} variant="danger" type="button" size="sm">
                      delete
                    </Button>
                  </td>
                </tr>
              )
          }
        </tbody>
      </Table>
  }

  render() {
    const { auth, products } = this.props;
    const { name, quantity, price, error, errorMessage, isfetching } = this.state;
    return (
      <div>
        {
          auth.isLoaded ?
            <Navbar bg="light" expand="lg">
              <Navbar.Brand href="#home">Firebase Demo</Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                { 
                  !auth.isEmpty ?
                    <Nav className="mr-auto">
                      <Nav.Link>{auth.email}</Nav.Link>
                      <Nav.Link onClick={(e) => this._logoutUser(e)}>Logout</Nav.Link>
                    </Nav>
                  :
                  <Nav className="mr-auto">
                    <Nav.Link href="/login">Login</Nav.Link>
                  </Nav>
                }
              </Navbar.Collapse>
            </Navbar>
          : <div className="progress">
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
          </div>
        }
        
        {/* Render Products */}
        <div className="products">
          { error && (
            <Alert variant="danger">
              {errorMessage}
            </Alert>
          )}
          <Form onSubmit={(e) => this.addProducts(e)}>
            <Form.Row>
              <Col>
                <Form.Control 
                    type="text" 
                    placeholder="Product Name" 
                    value={name}
                    onChange={e => this.setState({ name: e.target.value })} 
                  />
              </Col>
              <Col>
                <Form.Control 
                  type="number" 
                  placeholder="Quantity" 
                  value={quantity}
                  onChange={e => this.setState({ quantity: e.target.value })} 
                />
              </Col>
              <Col>
                <Form.Control 
                  type="number" 
                  placeholder="Price" 
                  value={price}
                  onChange={e => this.setState({ price: e.target.value })} 
                />
              </Col>
              <Col>
                {
                  isfetching ?
                    <Button variant="primary" type="submit" disabled>
                      Submit
                    </Button>
                    :
                    <Button variant="primary" type="submit">
                      Submit
                    </Button>
                }
              </Col>
            </Form.Row>
          </Form>
          { 
            products && (
              products.length > 0 ?
                this.renderProducts()  
              : <p className="empty-msg">No products found</p>
            )
          }
        </div>
      </div>
    );
  }
}


const query = () => {
  return [
    {
      collection: "products",
      storeAs: "products"
    },
  ];
};

export default compose(
  connect(state => ({
    auth: state.firebase.auth,
    products: state.firestore.ordered.products,
  })),
  firestoreConnect(() => query())
)(Dashboard);

