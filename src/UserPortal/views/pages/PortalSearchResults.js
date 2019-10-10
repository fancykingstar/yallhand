import React from "react";
import {inject, observer} from "mobx-react"
import { withRouter } from "react-router-dom"
import {Card, Image, Icon, Header, Modal, Button, Item} from "semantic-ui-react"
import { initSearchObj, stupidSearch } from "../../../SharedCalculations/StupidSearch";
import {S3Download} from "../../../DataExchange/S3Download"
import { downloadFilePortal } from "../../../DataExchange/DownloadFile"
import {PortalSearchLogo} from "../../../UserPortal-OLD/PortalSearchLogo"
import { giveMeKey } from "../../../SharedCalculations/GiveMeKey";
import { log } from "../../../DataExchange/Up"
import { ItsLog } from "../../../DataExchange/PayloadBuilder"
import Layout from '../../layouts/DefaultLayout';

@inject("UIStore", "AnnouncementsStore", "PoliciesStore", "ResourcesStore", "AccountStore")
@observer
class PortalSearchResults extends React.Component {
  componentDidMount(){
    window.scrollTo(0, 0);
  }
    render(){
    const {AnnouncementsStore, PoliciesStore, UIStore, ResourcesStore, AccountStore} = this.props
    
    // const downloadFile = (S3Key, label) => {
    //     const ext = "." + S3Key.split(".")[1]
    //     S3Download("quadrance-files/gramercy", S3Key, label, ext)
    //  }

    const filteredannouncement = () => {
        if (UIStore.search.portalSearchValue !== "") { const results = stupidSearch( UIStore.search.searchAnnouncementsData, UIStore.search.portalSearchValue );
          return AnnouncementsStore.allAnnouncements.filter(item => results.includes(item.announcementID));
        } else {
          return []
        }
      };
    
      const filteredPolicy = () => {
        if (UIStore.search.portalSearchValue !== "") { const results = stupidSearch( UIStore.search.searchPoliciesData, UIStore.search.portalSearchValue );
          return PoliciesStore.allPolicies.filter(item => results.includes(item.policyID));
        } else {
          return []
        }
      };

      const filteredFiles = () => {
        if (UIStore.search.portalSearchValue !== "") { const results = stupidSearch( UIStore.search.searchFilesData, UIStore.search.portalSearchValue );
          return ResourcesStore.fileResources.filter(item => results.includes(item.resourceID));
        } else {
          return []
        }
      };

      const filteredURLs = () => {
        if (UIStore.search.portalSearchValue !== "") { const results = stupidSearch( UIStore.search.searchUrlsData, UIStore.search.portalSearchValue );
          return ResourcesStore.urlResources.filter(item => results.includes(item.resourceID));
        } else {
          return []
        }
      };

    const filteredPeople = () => {
        if (UIStore.search.portalSearchValue !== "") { const results = stupidSearch( UIStore.search.searchPeopleData, UIStore.search.portalSearchValue );
            return AccountStore.allUsers.filter(item => results.includes(item.userID));
          } else {
            return []
          }
        };
    

    const contentResults = (content) => content.map(item =>
        <Item key={"searchres" + giveMeKey() } onClick={e => {
            UIStore.set("search", "portalDisplayResults", false)
            item.policyID !== undefined? this.props.history.push("/portal/learn-detail/" + item.policyID):
            this.props.history.push("/portal/announcement/" + item.announcementID) 

        }}
        >
            <Item.Image size="tiny" src={item.img}/>
            <Item.Content><Item.Header>{item.label}</Item.Header></Item.Content>
        </Item>
        )

    const resourceResults = (resources) => 
            resources.map(resource =>
            <Item key={"searchres" + giveMeKey() }>
                <Item.Content>
                    <Item.Header>
                    {resource.type !== undefined? <p style={{cursor: "pointer", color: "#1D7E9D"}} as="a" onClick={e => downloadFilePortal(resource.S3Key.split("gramercy/")[1], resource.label, resource.resourceID)}>{resource.label}</p> 
                    : <a 
                    onClick={e => log(ItsLog(false, {"type": "url", "id": resource.resourceID, "variation": ""}))}
                    href={resource.prefix + resource.url} target="_blank">{resource.label}</a>}
                    </Item.Header>
                </Item.Content>
            </Item>
            )

    const cardMeta = (user) => {
        let meta = []
        user.profile.Department === ""? null : meta.push(<Card.Meta key={giveMeKey()} ><a style={{color: "#17b0e4"}} href={`mailto:${user.email}`}><Icon name="mail"/> {user.email}</a></Card.Meta>)
        user.profile.Department === ""? null : meta.push(<Card.Meta key={giveMeKey()} style={{color: "#000000"}}><Icon name="map marker alternate"/> {user.profile.Location}</Card.Meta>)
        user.profile.Department === ""? null : meta.push(<Card.Meta key={giveMeKey()} style={{color: "#000000"}}><Icon name="phone"/>  {user.profile["Phone or Extension"]}</Card.Meta>)
        user.profile.Department === ""? null : meta.push(<Card.Meta key={giveMeKey()} style={{color: "#000000"}}><Icon name="mobile alternate"/> {user.profile.Mobile}</Card.Meta>)
        return meta
    }
    
        const socials = (user) => {
            let socials = []
            user.profile.Twitter === ""? null : socials.push(<p key={giveMeKey()}><a style={{color: "#17b0e4"}} href={`https://twitter.com/${user.profile.Twitter}`}><Icon key={giveMeKey()} name="twitter"/>Twitter</a></p>)
            user.profile.Medium === ""? null : socials.push(<p key={giveMeKey()}><a style={{color: "#17b0e4"}} href={`https://medium.com/@${user.profile.Medium}`}><Icon key={giveMeKey()} name="medium"/>Medium</a></p>)
            user.profile.Github === ""? null : socials.push(<p key={giveMeKey()}><a style={{color: "#17b0e4"}} href={`https://github.com/${user.profile.Twitter}`}><Icon key={giveMeKey()} name="github"/>Github</a></p>)
            user.profile.LinkedIn === ""? null : socials.push(<p key={giveMeKey()}><a style={{color: "#17b0e4"}} href={`https://linkedin.com/${user.profile.LinkedIn}`}><Icon key={giveMeKey()} name="linkedin"/>LinkedIn</a></p>)
            return socials
        }

    const peopleResults = (people) => {
        return people.map(user =>
            <Card key={"staffDir" + giveMeKey()}>
            <Card.Content>
              <Image floated="right" size="mini" src={user.img} />
              <Card.Header>{user.displayName}</Card.Header>
              <Card.Meta>{user.profile.Title}</Card.Meta>
              <Card.Description>{user.profile["About Me"]}</Card.Description>
            </Card.Content>
            <Card.Content>
                  {cardMeta(user)}
            </Card.Content>
            <Card.Content extra>
            {socials.length === 0? null :
          
              <Modal size="mini" closeIcon trigger={<Button basic>
                  More...
              </Button>}>
              <Modal.Header>{user.displayName}</Modal.Header>
              <Modal.Content>
              <Modal.Description>
                      {socials(user)}
              </Modal.Description>
              </Modal.Content>
              </Modal>
      
          }
                
      
            </Card.Content>
          </Card>
            )
    }
     
    const content = [...filteredannouncement(), ...filteredPolicy()].length === 0? null : 
        <React.Fragment>
        <Header style={{color: "#ABACAB", paddingBottom: 15}} as="h2">Announcements & FAQs</Header>
        <Item.Group divided>
            {contentResults([...filteredannouncement(), ...filteredPolicy()])}
        </Item.Group>
        </React.Fragment>

    const resources = [...filteredFiles(), ...filteredURLs()].length === 0? null : 
    <React.Fragment>
    <Header style={{color: "#ABACAB", paddingBottom: 15}} as="h2">Files</Header>
    <Item.Group divided>
        {resourceResults([...filteredURLs(), ...filteredFiles()])}
    </Item.Group>
    </React.Fragment>

    // const people = filteredPeople().length === 0? null : 
    // <div style={{paddingBottom: 10}}>
    // <Header style={{color: "#ABACAB", paddingBottom: 15}} as="h2">People</Header>
    // <Card.Group>
    //     {peopleResults(filteredPeople())}
    //     </Card.Group>
    // </div>




    const isSearchResults = 
    filteredannouncement().length !== 0 
    || filteredPolicy().length !== 0
    || filteredURLs().length !== 0
    || filteredFiles().length !== 0
    || filteredPeople().length !==0?
    <div style={{width: "100%", height: "100%", overflowY: "scroll", overflowX: "hidden",}}> 
    <div  style={{paddingTop: 5, paddingBottom: 15}} >
    <Button basic 
            onClick={e => {
              UIStore.set("search", "portalSearchValue", "")
            this.props.history.goBack() }} >
            Clear Results</Button>
    </div> 
    <div style={filteredPeople().length !==0? {paddingBottom: 10} : null}>
    {content}
    {resources}
    {/* {people} */}
  
    </div></div>
    :
    <PortalSearchLogo />

    return(
      <Layout pageTitle={"Surveys"}>
      <div style={{ paddingTop: 20 }} className="container">
        <div className="page_container">

    {isSearchResults}
    </div> </div>
      </Layout>
 
    )
}}

export default withRouter(PortalSearchResults)