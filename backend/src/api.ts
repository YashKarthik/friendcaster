import { utils } from 'ethers';
import got from "got";

interface IDirectory {
  directoryUrl: string;
  directoryBody: {
    version: number;
    proofUrl: string;
    avatarUrl: string;
    timestamp: number;
    displayName: string;
    addressActivityUrl: string;
  }
}

export const getDirectory = async (username: string, registryContract:any): Promise<IDirectory>  => {

  const byte32Name = utils.formatBytes32String(username);
  const directoryUrl = await registryContract.getDirectoryUrl(byte32Name);

  const directoryResponse = await got(directoryUrl);
  const directoryBody = JSON.parse(directoryResponse.body).body;

  return {
    directoryUrl,
    directoryBody
  };
}

export const getAvatarUrl  = async (username: string, registryContract:any): Promise<string>  => {
  const { directoryBody } = await getDirectory(username, registryContract);
  const avatarUrl = directoryBody.avatarUrl;
  return avatarUrl;
}

interface IAvatarUrlObj { [key: string]: string }

/* Takes a list of users and returns a username:avatar_url pair object
 * @return {object of type IAvatarUrlObj}   an object(k,v) where k=username, v=avatar url
 */

export const getAvatarListUrl  = async (usernames: string[], registryContract:any): Promise<IAvatarUrlObj> => {
  const avatarUrlObj: IAvatarUrlObj = {};

  await Promise.all(usernames.map(async username => {
    const url = await getAvatarUrl(username, registryContract);
    avatarUrlObj[username] = url;
  }))

  return avatarUrlObj;
}
