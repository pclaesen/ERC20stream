import React, { useState } from 'react';
import styles from '../page.module.css';
import axios from 'axios';
import { ethers } from 'ethers';

import { streamCreatorABI } from '../abi/streamCreatorABI';

const contractAddress = "0xbE431CeacE289458dE2Eca8FAc30854B2a4aDe31";
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const streamCreatorContract = new ethers.Contract(contractAddress, streamCreatorABI, signer);
export const contractWithSigner = streamCreatorContract.connect(signer);

const InputForm = ({ onSubmit }) => {
  const [githubHandle, setGithubHandle] = useState('sablier-labs');
  const [teamMembers, setTeamMembers] = useState([]);
  const [teamMembersAddress, setTeamMembersAddress] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    onSubmit(githubHandle);

    try {
      const response = await axios.get(`https://api.github.com/orgs/${githubHandle}/members`);
      //console.log(response);
      const membersWithWallet = response.data.map((member) => ({
        ...member,
        walletAddress: '', // Add walletAddress field
      }));
      setTeamMembers(membersWithWallet);
    } catch (error) {
      console.error('Error fetching team members:', error);
    }
  };

  const handleWalletAddressChange = (id, newAddress) => {
    setTeamMembers((prevMembers) =>
      prevMembers.map((member) =>
        member.id === id ? { ...member, walletAddress: newAddress } : member
      )
    );
  };

  const handleFinalSubmit = async() => {
    const addresses = teamMembers.map(member => member.walletAddress);
    setTeamMembersAddress(addresses);
    console.log('Final submitted team members:', teamMembers);
    console.log('Team members addresses:', addresses);
    // Additional logic for final submission can be added here
    if (typeof window.ethereum !== 'undefined') {
      try {
        let approve = await underlyingUSDC.approve(contractAddress, amountToApprove);
        await approve.wait();
        let createTheStreams = contractWithSigner.batchCreateStreams(10e6, teamMembersAddress[0], teamMembersAddress[1]);
        await createTheStreams(2);
        console.log("streams created");
    
      } catch (error) {
        console.error('Request handling failed', error);
      }
    }
  }

  const logTeamMembersArray = () => {
    console.log(teamMembers);
  };

  return (
    <div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          value={githubHandle}
          onChange={(e) => setGithubHandle(e.target.value)}
          className={styles.input}
          placeholder="Enter Github handle"
        />
        <div className={styles['button-group']}>
          <button type="submit" className={styles.button}>
            Submit
          </button>
          <button type="button" onClick={logTeamMembersArray} className={styles.button}>
            Log team members
          </button>
        </div>
      </form>

      {teamMembers.length > 0 && (
        <div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Username</th>
                <th>Profile URL</th>
                <th>Wallet Address</th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.map((member) => (
                <tr key={member.id}>
                  <td>{member.login}</td>
                  <td>
                    <a href={member.html_url} target="_blank" rel="noopener noreferrer">
                      {member.html_url}
                    </a>
                  </td>
                  <td>
                    <input
                      type="text"
                      value={member.walletAddress}
                      onChange={(e) => handleWalletAddressChange(member.id, e.target.value)}
                      className={`${styles.input} ${styles['input-full-width']}`}
                      placeholder="Enter wallet address"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button onClick={handleFinalSubmit} className={`${styles.button} ${styles['button-wide']}`}>
            Submit Wallet Addresses
          </button>
        </div>
      )}
    </div>
  );
};

export default InputForm;
