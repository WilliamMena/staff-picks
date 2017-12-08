import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import testData from './testData.js';
import BookStore from '../../stores/BookStore';

function extractIsbns(bib) {
  var isbns = [];

  bib.varFields.forEach((varField) => {
    if (varField.fieldTag === 'i' && varField.marcTag === '020') {
      const isbn = varField.subfields[0].content.substr(0, varField.subfields[0].content.indexOf(' '));

      if (isbn) {
        isbns.push(isbn);
      }
    }
  });

  return isbns;
}

function extractPublisher(bib) {
  var publisher = '';

  bib.varFields.forEach((varField) => {
    if (varField.fieldTag === 'b' && varField.marcTag === '710') {
      publisher = varField.subfields[0].content;
    }
  });

  return publisher;
}

class RelatedBibs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: '',
      bibs: BookStore.getState().relatedBibs || [],
    };

    this.renderbib = this.renderBib.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    BookStore.listen(this.onChange);
  }

  componentWillUnmount() {
    BookStore.unlisten(this.onChange);
  }

  onChange() {}

  renderBib(bib, i) {
    const isbns = extractIsbns(bib);
    const publisher = extractPublisher(bib);

    return (
      <div key={i}>
        <a href={`https://browse.nypl.org/iii/encore/record/C__Rb${bib.id}`}>
          <img src={`https://contentcafe2.btol.com/ContentCafe/Jacket.aspx?&userID=NYPL49807&password=CC68707&Value=${isbns[0]}&content=S&Return=1&Type=M`} alt="" />
          <h3>{bib.title}</h3>
        </a>
        <p>{bib.author}</p>
        <p>{publisher}</p>
        <p>{bib.publishYear}</p>
        <p>{bib.lang.name}</p>
      </div>
    );
  }

  render() {
    console.log(this.state.bibs)

    if (!this.state.bibs && !this.state.bibs.length) {
      return <div>Loading...</div>;
    }

    return (
      <div>
        {
          this.state.bibs.map((bib, i) => this.renderBib(bib, i))
        }
      </div>
    );
  }
}

RelatedBibs.propTypes = {
  pick: PropTypes.object,
  relatedBibs: PropTypes.array,
};

export default RelatedBibs;
