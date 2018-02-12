
def ORG = "mayadataio"
def REPO = "maya-ui"
def DOCKER_HUB_REPO = "https://index.docker.io/v1/"
def DOCKER_IMAGE = ""
def BRANCH_NAME = BRANCH_NAME.toLowerCase()

pipeline {
    agent {
        label {
            label ""
            customWorkspace "/var/lib/jenkins/workspace/${REPO}-${BRANCH_NAME}-${BUILD_NUMBER}"
        }
    }

    stages {
        stage('Place the UI-_hash_.tar.gz in the build artifacts') {
            steps {
                echo "Workspace dir is ${pwd()}"
	              script {
	                 GIT_SHA = sh(
		                       returnStdout: true,
				                   script: "git log -n 1 --pretty=format:'%h'"
				                  ).trim()
		               //echo "Checked out commit: ${env.GIT_COMMIT}"
		               echo "Checked out branch: ${env.BRANCH_NAME}"
		               /*  1. Get the image tag  of the latest builds of maya-io-agent and cluster-register
		                   2. Build ther cattle.jar
		                   3. Update the image tag in #1 in cattle-properties.jar
		                   4. Tar the package and cp to /tmp/matadata-io/maya-io-server/<branch_name>/cattle-<sha>.jar
		               */

                   sh(
                      script: "sudo rm -rf /tmp/$ORG/${REPO}/${BRANCH_NAME}/*",
                      returnStdout: true
                   )
                   sh(
                     script: "mkdir -p /tmp/$ORG/${REPO}/${BRANCH_NAME}/",
                     returnStdout: true
                   )
                   sh(
                     script: "./jenkins_deps.sh",
                     returnStdout: true
                   )
                   sh(
                     script: "touch /tmp/${ORG}/${REPO}/${BRANCH_NAME}/${GIT_SHA}",
                     returnStdout: true
                   )

                   DEST = sh(
                          script: "echo /tmp/${REPO}/${ORG}/${BRANCH_NAME}/",
                          returnStdout: true
                          )

                   sh(
                     script: "./copy.sh ${BRANCH_NAME}",
                     returnStdout: true
                   )

                   build job: '../maya-io/staging', propagate: true, quietPeriod: 2, wait: true
             }
	         }
        }
/*
https://wiki.jenkins.io/display/JENKINS/Copy+Artifact+Plugin#CopyArtifactPlugin-Usewithdeclarativepipelines
        stage('Copy Archive') {
          steps {
             script {
                 step ([$class: 'CopyArtifact',
                 projectName: 'maya-ui',
                 filter: "packages/infra*.zip",
                 target: 'Infra']);
             }
          }
        }

*/
        stage('Later stage') {
            steps {
	             script {
	                echo "Do blah blah ..."
	                /*def BRANCH = sh(
		                     script: "echo ${GIT_BRANCH} | sed 's/\\/\\{1,\\}/-/g'",
		                     //script: "echo ${GIT_BRANCH}" | sed s/\/\{1,\}/-/g,
				          returnStdout: true
			            ).trim()
	                */
		              //sh(returnStdout: true, script: "docker tag ${REPO}-${BRANCH_NAME}:HEAD ${ORG}/${REPO}:${BRANCH_NAME}-${GIT_SHA}" )
		           }
	          }
         }

        stage('Publish') {
            steps {
	              script {
	                  echo "Publish the jar with the updated tags"
	                  /*def BRANCH = sh(
		                     script: "echo ${GIT_BRANCH} | sed 's/\\/\\{1,\\}/-/g'",
		                     script: "echo ${GIT_BRANCH}" | sed s/\/\{1,\}/-/g,
				                 returnStdout: true
			                ).trim()
	                  */
		               //sh(returnStdout: true, script: "docker tag ${REPO}-${BRANCH_NAME}:HEAD ${ORG}/${REPO}:${BRANCH_NAME}-${GIT_SHA}" )
		            }
	          }
	      }
  }

    post {
        always {
            echo 'This will always run'
            //deleteDir()
        }
        success {
            echo 'This will run only if successful'
            slackSend channel: '#ui',
                   color: 'good',
                   message: "The pipeline ${currentBuild.fullDisplayName} completed successfully :dance: :thumbsup: "

	      }
        failure {
            echo 'This will run only if failed'
            slackSend channel: '#maya-io',
                color: 'RED',
                message: "The pipeline ${currentBuild.fullDisplayName} failed. :scream_cat: :japanese_goblin: "
        }
        unstable {
            echo 'This will run only if the run was marked as unstable'
/*            slackSend channel: '#maya-io',
                   color: 'good',
                   message: "The pipeline ${currentBuild.fullDisplayName} is unstable :scream_cat: :japanese_goblin: "
*/
	}
        changed {
/*            slackSend channel: '#maya-io',
                   color: 'good',
                   message: "Build ${currentBuild.fullDisplayName} is now stable :dance: :thumbsup: "
            echo 'This will run only if the state of the Pipeline has changed'
*/            echo 'For example, if the Pipeline was previously failing but is now successful'
        }
    }
}
