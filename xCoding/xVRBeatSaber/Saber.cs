using UnityEngine;
using System.Collections;

public class Saber : MonoBehaviour {
    public TrailRenderer trail;
    public LayerMask layer;
    Vector3 prevPos;
    public AudioClip hitSound;

    void Start() {
        prevPos = transform.position;
        //if (trail != null)
        //trail.Begin();

        if (trail != null) {
            trail.Clear();
            trail.emitting = true;
        }
    }

    void Update() {
        RaycastHit hit;

        if (Physics.Raycast(transform.position, transform.forward, out hit, 2, layer)) {
            Vector3 v1 = transform.position - prevPos;
            if (Vector3.Angle(v1, hit.transform.up) > 130) {
                if (hitSound != null) {
                    AudioSource.PlayClipAtPoint(hitSound, hit.transform.position);
                }


                ComboManager.Instance.AddCombo();  // AddCombo를 여기 안으로
                Note note = hit.transform.GetComponent<Note>();
                if (note != null && note.hitEffect != null) {
                    // 2. 큐브에 등록된 이펙트를 그 자리에 생성합니다.
                    GameObject effect = Instantiate(note.hitEffect, hit.transform.position, Quaternion.identity);
                    Destroy(effect, 2f); // 이펙트 자동 삭제
                }
                Destroy(hit.transform.gameObject);  // Destroy는 1번만
            }
        }
        prevPos = transform.position;
    }

    private void OnDestroy() {
        if (RhythmManager.Instance != null) {
            RhythmManager.Instance.OnMusicEnd -= GameEnd;
        }
    }

    public void GameEnd() {
        gameObject.SetActive(false);
    }
}
