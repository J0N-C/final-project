import React from 'react';
import MainHeader from '../components/main-header';
import SubHeader from '../components/sub-header';
import Navbar from '../components/navbar';

export default function Home(props) {
  return (
      <>
        <MainHeader />
        <SubHeader />
        <div id="homepage">
          PLACEHOLDER
        </div>
        <Navbar />
      </>
  );
}
